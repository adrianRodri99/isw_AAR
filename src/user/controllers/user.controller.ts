/* eslint-disable prettier/prettier */
import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';

//import { AppRecursos, AppRoles } from 'src/app.roles';

//creo yo
import { CreateUserDTO } from '../dto/createUser.dto';
import { UpdateUserDTO } from '../dto/update.User.dto';
import { UserService } from '../servicios/user.service';
import { AppRecursos } from 'src/app.roles';
import { Auth } from 'src/decorators/auth.decorator';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Usuario } from '../entidad/Usuario.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/user')
export class UserController {
    constructor(
        private userservice: UserService,
        @InjectRolesBuilder()
        private rolesBuilder: RolesBuilder
    ){}

    @Get()
    getAll(){
        return this.userservice.getUsers();
    }
    //@ApiParam({type: number})
    @Get(':id')
    buscarOneID(@Param('id', ParseIntPipe) id:number){
        return this.userservice.buscaId(id);
    }

    // @Get(':user')
    // buscarOneUser(@Param('user') user:string){
    //     return this.userservice.buscaUser(user);
    // }

    //crear puede todos pueden crearse ellos mismos but crear admin solo los admin
    @ApiBody({type: CreateUserDTO})
    @Post('public')
    createPublic(@Body() body: CreateUserDTO){
        
        body.roles= ['usuario']    
        return this.userservice.create(body);
    }

    //solo crea el admin
    @Auth({
        possession: 'any',
        resource: AppRecursos.USER,
        action: 'create'
    })
    @ApiBody({type: CreateUserDTO})
    @Post()
    create(@Body() body: CreateUserDTO){
          
        return this.userservice.create(body);
    }



    //update solo pueden ellos mismos y el admin---------------------------------------------------------
    @Auth({
        possession: 'own',
        resource: AppRecursos.USER,
        action: 'update'
    })
    @ApiBody({type: UpdateUserDTO})
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id:number, 
        @Body() body: UpdateUserDTO,
        @UserDecorator() user: Usuario
        ){
        const {roles, ...rest}= body
        if(!this.rolesBuilder
                .can(user.roles)
                .updateAny(AppRecursos.USER)
                .granted
            ){
                if(roles ) throw new UnauthorizedException('No puedes cambiar el rol')
                if( Object.entries(rest).length===0) throw new BadRequestException('No puedes enviar la modificacion vacia')
                return this.userservice.update(id, rest, user)
            }
            
        if( Object.entries(body).length===0) throw new BadRequestException('No puedes enviar la modificacion vacia')
        return this.userservice.update(id, body);
    }
    
    //delete ellos mismos y el admin
    @Auth({
        possession: 'own',
        resource: AppRecursos.USER,
        action: 'delete'
    })
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number, @UserDecorator() user: Usuario){
        if(!this.rolesBuilder
            .can(user.roles)
            .deleteAny(AppRecursos.USER)
            .granted
        ){
            return this.userservice.delete(id, user)
        }
        return this.userservice.delete(id);
    }
}

