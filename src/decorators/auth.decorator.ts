/* eslint-disable prettier/prettier */

import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Role, ACGuard, UseRoles } from "nest-access-control";
import { JwtAuthGuard } from "src/auth/guard/jwt-guard";


export function Auth(...roles: Role[]){
    return applyDecorators(
        UseGuards(JwtAuthGuard, ACGuard),
        UseRoles(...roles),
        ApiBearerAuth()
    )
}

