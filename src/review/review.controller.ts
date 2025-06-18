import {
  Body,
  Controller,
  HttpException,
  Inject,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const storage = diskStorage({
  destination: './uploads/reviews',
  filename: (req, file, cb) => {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});
@Controller('/api/review')
export class ReviewController {
  constructor(
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor({ storage }))
  async giveReview(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: any,
    @Req() req: any,
  ): Promise<any> {
    const user_id = req.user.user_id;
    const imageUrls = (files || []).map(
      (file) => `/uploads/reviews/${file.filename}`,
    );

    if (imageUrls.length > 3) {
      throw new HttpException(
        { success: false, message: 'Max 3 images allowed' },
        400,
      );
    }

    const payload = { ...data, user_id, images: imageUrls };

    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'review', action: 'giveReview' },
        payload,
      ),
    );

    if (!result.success) {
      throw new HttpException(
        {
          success: result.success || false,
          message: result.message || 'Internal Server Error',
          errors: result.errors || [],
        },
        result.statusCode || 500,
      );
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(AnyFilesInterceptor({ storage }))
  async editReview(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: any,
    @Req() req: any,
  ): Promise<any> {
    const user_id = req.user.user_id;
    const imageUrls = (files || []).map(
      (file) => `/uploads/reviews/${file.filename}`,
    );

    if (imageUrls.length > 3) {
      throw new HttpException(
        { success: false, message: 'Max 3 images allowed' },
        400,
      );
    }

    // di controller
    const keepImages = data.keep_images ? JSON.parse(data.keep_images) : [];

    // jika ada file upload (baru)
    const uploaded = (files || []).map((f) => `/uploads/reviews/${f.filename}`);

    // merge semua jadi satu array
    const allImages = [...keepImages, ...uploaded];

    // lalu kirim ke service
    const payload = {
      ...data,
      user_id,
      images: allImages,
    };

    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'review', action: 'editReview' },
        payload,
      ),
    );

    if (!result.success) {
      throw new HttpException(
        {
          success: result.success || false,
          message: result.message || 'Internal Server Error',
          errors: result.errors || [],
        },
        result.statusCode || 500,
      );
    }

    return result;
  }
}
