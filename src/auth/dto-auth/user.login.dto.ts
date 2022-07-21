/* eslint-disable prettier/prettier */

import { ApiProperty,  } from "@nestjs/swagger";
import {  IsString, MaxLength, MinLength } from "class-validator";


export class UserLoginDTO {
    //apiproperty para el swagger
    
    @ApiProperty({type: String})
    @IsString()
    usuario: string;
    
    @ApiProperty({type: String})
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    
}

