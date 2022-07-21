/* eslint-disable prettier/prettier */

import { PartialType } from "@nestjs/swagger";
import { CreateDeporteDTO } from "./createDeporte.dto";


export class UpdateDeporteDTO extends PartialType(CreateDeporteDTO){}