import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

export function registerOpenAPI(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('Device Location Service')
    .setDescription('Provides geo location services for our devices.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
