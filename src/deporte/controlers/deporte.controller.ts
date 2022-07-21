/* eslint-disable prettier/prettier */
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppRecursos } from 'src/app.roles';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateDeporteDTO } from '../dto/createDeporte.dto';
import { UpdateDeporteDTO } from '../dto/updateDeporte.dto';

import { DeporteService } from '../servicios/deporte.service';

@ApiTags('Deporte')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/deporte')
export class DeporteController {

    constructor(
        private deporService: DeporteService
    ){}
    
    @Get()
    getAll(){
        return this.deporService.getDeportes()
    }
    @Get(':id')
    buscarOneID(@Param('id', ParseIntPipe) id:number){
        return this.deporService.buscaId(id)
    }

    @Auth({
        possession: 'any',
        resource: AppRecursos.DEPORTE,
        action: 'create'
    })
    @ApiBody({type: CreateDeporteDTO})
    @Post()
    create(@Body() body: CreateDeporteDTO){
        return this.deporService.create(body)
    }

    
    @Auth({
        possession: 'any',
        resource: AppRecursos.DEPORTE,
        action: 'update'
    })
    @ApiBody({type: UpdateDeporteDTO})
    @Put(':id')
    update(@Param('id', ParseIntPipe) id:number, @Body() body: UpdateDeporteDTO){
        return this.deporService.update(id,body)
    }

    
    @Auth({
        possession: 'any',
        resource: AppRecursos.DEPORTE,
        action: 'delete'
    })
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.deporService.delete(id)
    }

    //falta el update y el buscar por id y por nombre del deporte




}
