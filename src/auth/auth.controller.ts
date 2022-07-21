/* eslint-disable prettier/prettier */
import {  Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Usuario } from 'src/user/entidad/Usuario.entity';
import { UserLoginDTO } from './dto-auth/user.login.dto';



@ApiTags('Auth')
@Controller('api/login')
export class AuthController {
    
    constructor(
        private authService: AuthService
    ){}
    
    @UseGuards(AuthGuard('local'))
    @ApiBody({type: UserLoginDTO})
    @Post()
    async login(
            @UserDecorator() user: Usuario,
            @Body() body: UserLoginDTO
        ){
        //return user //viaja bien el usuario
        return this.authService.login(user)
    }

    @UseGuards(AuthGuard('jwt'))// proteger la ruta
    @ApiBearerAuth()// proteger la ruta
    @Get('perfil')
    async profile(@UserDecorator() user: Usuario){
        const {password, ...rest}= user
        return {message: 'esta protegido el usuario =>', rest}
    }
}
