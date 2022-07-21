/* eslint-disable prettier/prettier */
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppRecursos } from 'src/app.roles';
import { Auth } from 'src/decorators/auth.decorator';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Usuario } from 'src/user/entidad/Usuario.entity';
import { CreateDeportistaDTO } from '../dto/createDeportista.dto';
import { DeportistaService } from '../servicios/deportista.service';


@ApiTags('Deportista')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/deportista')
export class DeportistaController {
    constructor(
        private deportistaService: DeportistaService
    ){}

    @Get()
    getAll(){
        return this.deportistaService.getAll()
    }
    // @Get(':id')
    // buscarOneID(@Param('id', ParseIntPipe) id:number){
    //     return this.deportistaService.getOne(id)
    // }

    @Auth({
        possession: 'own',
        resource: AppRecursos.DEPORTISTA,
        action: 'create'
    })
    @ApiBody({type: CreateDeportistaDTO})
    @Post()
    create(@Body() body: CreateDeportistaDTO, @UserDecorator() user: Usuario){
        return this.deportistaService.create(body, user)
    }


    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.deportistaService.delete(id)
    }
}
