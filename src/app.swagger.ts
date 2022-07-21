/* eslint-disable prettier/prettier */

import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const initSwagger= (app: INestApplication)=>{
    const swaggerConfig= new DocumentBuilder()
        .setTitle('Back UCI_ISW-Deportistas')
        .addBearerAuth()
        .setDescription('Esta api es para la gestion de deportistas de la UCI proyecto de ISW.')
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('/docs',app,document)
}

