/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt';
import { AccessControlModule } from 'nest-access-control';

//import { DeportistaModule } from './deportista/deportista.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { DATABASE_HOST, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } from './config/constans';
import { rol } from './app.roles';
import { DeporteModule } from './deporte/deporte.module';
import { DeportistaModule } from './deportista/deportista.module';




@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config :ConfigService)=>({
        type: 'postgres',
        host: config.get<string>(DATABASE_HOST),
        port: parseInt(config.get<string>(DATABASE_PORT)),
        username: config.get<string>(DATABASE_USERNAME),
        password: config.get<string>(DATABASE_PASSWORD),
        database: config.get<string>(DATABASE_NAME),
        entities: [`${__dirname}./**/**/*entity{.ts,.js}`],
        autoLoadEntities: true,
        synchronize: true,
        retryAttempts:10,
        retryDelay: 3000,
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env'
    }),
    AccessControlModule.forRoles(rol),

    UserModule,
    //DeportistaModule,
    AuthModule,
    DeporteModule,
    DeportistaModule,  
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AppModule {}


