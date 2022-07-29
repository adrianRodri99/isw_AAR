/* eslint-disable prettier/prettier */
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppRecursos } from 'src/app.roles';
import { Auth } from 'src/decorators/auth.decorator';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Usuario } from 'src/user/entidad/Usuario.entity';
import { CreateDeportistaDTO } from '../dto/createDeportista.dto';
import { EliminarDTO } from '../dto/eliminarDTO';
import { DeportistaService } from '../servicios/deportista.service';


@ApiTags('Deportista')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/deportista')
export class DeportistaController {
    constructor(
        private deportistaService: DeportistaService,
        @InjectRolesBuilder()
        private rolesBuilder: RolesBuilder
    ){}

    @Get()
    getAll(){
        return this.deportistaService.getAll()
    }
    @Get(':id')
    buscarOneID(@Param('id', ParseIntPipe) id:number){
        return this.deportistaService.getOne(id)
    }

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

    @Auth({
        possession: 'own',
        resource: AppRecursos.DEPORTISTA,
        action: 'delete'
    })
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number, @UserDecorator() user: Usuario){
        if(!this.rolesBuilder
            .can(user.roles)
            .deleteAny(AppRecursos.DEPORTISTA)
            .granted
        ){
            
            return this.deportistaService.delete(id, user)
        }
        
        return this.deportistaService.delete(id)
    }

    @Auth({
        possession: 'own',
        resource: AppRecursos.DEPORTISTA,
        action: 'delete'
    })
    @ApiBody({type: EliminarDTO})
    @Delete('deporte/:id')
    deleteSport(@Param('id', ParseIntPipe) id:number, @Body() body: EliminarDTO, @UserDecorator() user: Usuario ){
        if(!this.rolesBuilder
            .can(user.roles)
            .deleteAny(AppRecursos.DEPORTISTA)
            .granted
        )
        {
            return this.deportistaService.deleteDeporte(id, body, user)
        }
        console.log('llego sin user')
        return this.deportistaService.deleteDeporte(id, body)
    }

}
