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
  app.useStaticAssets(join(process.cwd(), '/uploads'), {
    prefix: '/uploads/', // Define the route prefix for accessing assets
  });

  // Enable CORS
  app.enableCors({
    origin: '*', // Allows all origins
  });

  // Start the HTTP server
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
