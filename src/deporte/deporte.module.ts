/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';
import { DeporteService } from './servicios/deporte.service';
import { DeporteController } from './controlers/deporte.controller';
import { Deporte } from './entidad/Deporte.entity';
import { Usuario } from 'src/user/entidad/Usuario.entity';
import { Deportista } from 'src/deportista/entidad/deportista.entity';



@Module({
  providers: [DeporteService],
  controllers: [DeporteController],
  imports: [ 
        TypeOrmModule.forFeature([Deporte, Usuario, Deportista]),
        UserModule,   
    ],

})
export class DeporteModule {}
