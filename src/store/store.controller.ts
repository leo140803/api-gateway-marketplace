import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';

@Controller('/api/store')
export class StoreController {
  private marketplaceClient: ClientProxy;

  constructor() {
    this.marketplaceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: 3001 }, // Replace with your microservice configuration
    });
  }

  @Get()
  async findAll(): Promise<any> {
    console.log('Fetching all stores');
    return this.marketplaceClient
      .send({ service: 'marketplace', module: 'store', action: 'findAll' }, {})
      .toPromise();
  }

  @Get('search')
  async searchStores(@Query('q') query: string): Promise<any> {
    console.log(`Searching stores with keyword: ${query}`);

    if (!query || query.trim() === '') {
      throw new HttpException('Query parameter is required', 400);
    }

    try {
      const response = await this.marketplaceClient
        .send(
          { service: 'marketplace', module: 'store', action: 'search' },
          { query },
        )
        .toPromise();

      return response;
    } catch (error) {
      console.error('Error searching stores:', error.message);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    console.log(`Fetching store with ID: ${id}`);
    return this.marketplaceClient
      .send(
        { service: 'marketplace', module: 'store', action: 'findOne' },
        { id },
      )
      .toPromise();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    console.log('Creating a new store');

    let fileName: string | null = null;
    let imageUrl: string | null = null;

    if (file) {
      console.log('Processing file upload...');
      if (!Buffer.isBuffer(file.buffer)) {
        throw new Error('Invalid file buffer');
      }

      // Set the upload directory to the root-level uploads/storeLogo
      const uploadDir = join(process.cwd(), 'uploads/storeLogo');

      fileName = `store-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      const uploadPath = join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(uploadPath, file.buffer);
      console.log('File saved successfully:', uploadPath);

      imageUrl = `/uploads/storeLogo/${fileName}`;
    }

    const payload = { ...body, image_url: imageUrl };

    return this.marketplaceClient
      .send(
        { service: 'marketplace', module: 'store', action: 'create' },
        payload,
      )
      .toPromise();
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    console.log(`Updating store with ID: ${id}`);

    let fileName: string | null = null;
    let imageUrl: string | null = null;

    if (file) {
      console.log('Processing file upload...');
      if (!Buffer.isBuffer(file.buffer)) {
        throw new Error('Invalid file buffer');
      }

      fileName = `store-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      const uploadPath = join(process.cwd(), 'uploads/storeLogo', fileName);

      if (!fs.existsSync(join(process.cwd(), 'uploads/storeLogo'))) {
        fs.mkdirSync(join(process.cwd(), 'uploads/storeLogo'), {
          recursive: true,
        });
      }

      fs.writeFileSync(uploadPath, file.buffer);
      console.log('File saved successfully:', uploadPath);
      imageUrl = `/uploads/storeLogo/${fileName}`;
    }

    const payload = { id, ...body, image_url: imageUrl };

    return this.marketplaceClient
      .send(
        { service: 'marketplace', module: 'store', action: 'update' },
        payload,
      )
      .toPromise();
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    console.log(`Deleting store with ID: ${id}`);
    try {
      const response = await this.marketplaceClient
        .send(
          { service: 'marketplace', module: 'store', action: 'delete' },
          { id },
        )
        .toPromise();

      if (response?.data?.image_url) {
        const filePath = join(process.cwd(), response.data.image_url);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the file
          console.log(`Deleted file: ${filePath}`);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      }

      return {
        data: response.data,
        message: 'Successfully deleted store and associated image (if any)',
        success: true,
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error deleting store:', error.message);
      throw error;
    }
  }
}
