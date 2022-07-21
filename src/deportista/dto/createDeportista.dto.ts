/* eslint-disable prettier/prettier */

import { IsObject, IsString, MaxLength, MinLength } from "class-validator";


import { Deporte } from "src/deporte/entidad/Deporte.entity";
import { Usuario } from "src/user/entidad/Usuario.entity";


export class CreateDeportistaDTO{
   
    @IsString()
    grupo: string;
    
    @IsString()
    usuario: string
    
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string
    
    @IsString()
    deporte: string

}


