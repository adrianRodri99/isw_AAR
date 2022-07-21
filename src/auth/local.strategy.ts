/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {  Strategy } from "passport-local";

import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            usernameField: 'usuario',
            passwordField: 'password'
        });
    }

    async validate(usuario: string, password: string): Promise<any>{
        
        const user= await this.authService.validarUser(usuario, password);
        if(!user){
            throw new UnauthorizedException('Login user or password invalid');
        }

        return user;
    }
    
}
