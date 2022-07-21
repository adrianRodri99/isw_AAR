/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hash } from 'bcrypt';
import { Repository } from 'typeorm';

//creo yo
import { CreateUserDTO } from '../dto/createUser.dto';
import { UpdateUserDTO } from '../dto/update.User.dto';
import { Usuario } from '../entidad/Usuario.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Usuario)
        private userRepo: Repository<Usuario>
    ){}

    async getUsers(): Promise<Usuario[]>{
        const res= await this.userRepo.find();
        if(res.length == 0) throw new NotFoundException('no hay usuarios') ;
        return res;
    }
    async buscaId(user_id: number, userRT?: Usuario) {
        const res=await this.userRepo.findOne({where: {id_user: user_id}})
            .then(u => !userRT? u: !!u && userRT.id_user === u.id_user ? u : null )
            //los dos !! se ponen obligados si no los pongo devuelve la un null dentro de la promesa 
        if(!res) throw new NotFoundException('no existe el user buscado o no esta autorizado ha realizar la accion'); 
       

        return res;
    }
    async buscaUser(user: string) {
        const res = await this.userRepo
            .createQueryBuilder('usuario')
            .where({usuario: user})
            .getOne()
        if(!res) throw new NotFoundException('no existe el usuario')
        return res
    }

    async create(body: CreateUserDTO) {
        //verifica si existe el usario porque no puede ser duplicado es unico
        const verificaUsuario = await this.userRepo
            .createQueryBuilder('usuario')
            .where({usuario: body.usuario})
            .getOne()
        if(verificaUsuario)throw new ForbiddenException('ya existe el usuario, cambie el campo usuario')

        //no me funciona en la entidad xq el beforeinsert no se ejecuta
        body.password= await hash(body.password, 10)
        
        const res= await this.userRepo.save(body)
        delete res.password

        return {message: 'user creado', res}; 
    }


    async update(id:number, body: UpdateUserDTO, userRT?: Usuario){
        //verifica si existe el usario porque no puede ser duplicado es unico
        const verificaUsuario = await this.userRepo
            .createQueryBuilder('usuario')
            .where({usuario: body.usuario})
            .getOne()
        if(verificaUsuario)throw new ForbiddenException('ya existe el usuario, cambie el campo usuario')
                
        const verifica= await this.buscaId(id, userRT)
        if(body.password){
            body.password= await hash(body.password, 10)
        }

        const res= await this.userRepo.update(id, body) 
        
        return {message: 'user actualizado', res}
    }

    async delete(id: number, userRT?: Usuario){
        const verifica= await this.buscaId(id, userRT)
        
        const res= await this.userRepo.delete(id);
        return  {message: 'user eliminado', res};
    }

}
