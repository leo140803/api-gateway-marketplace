import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();

  // Cast the app as NestExpressApplication to use `useStaticAssets`
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Start microservices if any
  await app.startAllMicroservices();

  // Body parser configuration
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors({
    origin: '*', // Allows all origins
  });

  // Start the HTTP server
  await app.listen(
    Number(process.env.HTTP_PORT) || 3001,
    process.env.HTTP_HOST || '0.0.0.0',
  );
  console.log(`Application is running on: http://127.0.0.1:3001`);
}
bootstrap();
