/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, compareSync } from 'bcrypt';
import { Usuario } from 'src/user/entidad/Usuario.entity';

import { UserService } from 'src/user/servicios/user.service';
import { jwtConstants } from './auth.constantes';

//el usuario es el email en realidad

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ){}
    
    async validarUser(usuario: string, password: string){
        const log = await this.userService.buscaUser(usuario)
        const compara= await compare(password, log.password)
        if(log && compara ) {            
                return log
            }
            return null
        }
    login(user: Usuario) {
        const payload = { usuario: user.usuario, sub: user.id_user };
        return {
            roles: user.roles, 
            access_token: this.jwtService.sign(payload, {secret: jwtConstants.secret}), 
        };
    }
}
