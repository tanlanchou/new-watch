import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log(`环境变量`);
  console.log(process.env.NODE_ENV);

  await app.listen(3000);
}
bootstrap();
