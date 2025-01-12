import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/faq')
export class FaqGatewayController {
  private faqServiceClient: ClientProxy;

  constructor() {
    this.faqServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: 3002 },
    });
  }

  @Get('/type/:type')
  async findByType(@Param('type') type: string): Promise<any> {
    return firstValueFrom(
      this.faqServiceClient.send(
        { service: 'faq', module: 'platform', action: 'findByType' },
        { type },
      ),
    );
  }

  @Get()
  async findAll(): Promise<any> {
    return firstValueFrom(
      this.faqServiceClient.send(
        { service: 'faq', module: 'platform', action: 'findAll' },
        {},
      ),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return firstValueFrom(
      this.faqServiceClient.send(
        { service: 'faq', module: 'platform', action: 'findOne' },
        { id },
      ),
    );
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any, @Request() req: any): Promise<any> {
    const payload = { ...body, user: req.user }; // Include user info from guard
    return firstValueFrom(
      this.faqServiceClient.send(
        { service: 'faq', module: 'platform', action: 'create' },
        payload,
      ),
    );
  }
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: any,
  ): Promise<any> {
    const payload = { id, ...body, user: req.user }; // Include user info
    return firstValueFrom(
      this.faqServiceClient.send(
        { service: 'faq', module: 'platform', action: 'update' },
        payload,
      ),
    );
  }
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any): Promise<any> {
    const payload = { id, user: req.user }; // Include user info
    return firstValueFrom(
      this.faqServiceClient.send(
        { service: 'faq', module: 'platform', action: 'remove' },
        payload,
      ),
    );
  }
}
