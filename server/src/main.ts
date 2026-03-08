import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Security middleware
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  )

  const PORT = process.env.PORT || 3000
  await app.listen(PORT)
  console.log(`Server listening on: ${PORT}`)
}

bootstrap()
