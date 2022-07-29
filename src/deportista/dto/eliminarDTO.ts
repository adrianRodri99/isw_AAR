/* eslint-disable prettier/prettier */

import { IsString } from "class-validator";


export class EliminarDTO{
    @IsString()
    deporte: string
}