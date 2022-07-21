/* eslint-disable prettier/prettier */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { Usuario } from "src/user/entidad/Usuario.entity"


export enum Sexo{
    masculino='masculino',
    femenino='femenino'
}



export class CreateDeporteDTO{
    
    @ApiProperty({type: String})
    @IsString()
    deporte: string

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    medalla: string

    @ApiProperty({type: String})
    @IsEnum(Sexo, {message:`sexo no valido, los campos validos son: ${Sexo.femenino} o ${Sexo.masculino}` })
    sexo: string

    @ApiProperty({type: Number})
    @IsNumber()
    capacidad: number

    @ApiPropertyOptional({type: String})
    @IsOptional()
    @IsString()
    user_capitan: string

    


}












