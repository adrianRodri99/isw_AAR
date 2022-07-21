/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { UserService } from './servicios/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entidad/Usuario.entity';

@Module({
  providers: [UserService,],
  controllers: [UserController],
  imports: [ TypeOrmModule.forFeature([Usuario]),  ],
  exports: [UserService]
})
export class UserModule {}
