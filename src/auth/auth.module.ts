/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config()

import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './auth.constantes';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from 'src/config/constans';


@Module({
    imports: [
        UserModule, 
        PassportModule.register({defaultStrategy: 'local'}),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService)=>({
                    secret: config.get<string>(JWT_SECRET),
                    signOptions: { expiresIn: '60s' },
            })
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],        
})
export class AuthModule {}
