/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { Deporte } from 'src/deporte/entidad/Deporte.entity';
import { Usuario } from 'src/user/entidad/Usuario.entity';
import { UserModule } from 'src/user/user.module';
import { DeportistaController } from './controlers/deportista.controller';
import { Deportista } from './entidad/deportista.entity';
import { DeportistaService } from './servicios/deportista.service';


@Module({
  controllers: [DeportistaController],
  providers: [DeportistaService],
  imports: [ 
    TypeOrmModule.forFeature([Deportista, Deporte, Usuario]),
    UserModule,   
],
})
export class DeportistaModule {}
