/* eslint-disable prettier/prettier */

import { ApiProperty,  } from "@nestjs/swagger";
import { IsArray, IsEnum,  IsOptional, IsString,  MaxLength, MinLength } from "class-validator";
import { AppRoles } from "src/app.roles";


export class CreateUserDTO {
    //apiproperty para el swagger
    @ApiProperty({type: String})
    @IsString()
    name: string;
    
    @ApiProperty({type: String})
    @IsString()
    usuario: string;
    
    @ApiProperty({type: String})
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    

    @IsOptional()
    @IsArray()
    @IsEnum(AppRoles, {each: true ,message: `rol no valido los roles son: ${AppRoles.USUARIO}, ${AppRoles.ADMIN} o ${AppRoles.CAPITAN}`})
    roles: string[]

    
}

