/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Usuario } from 'src/user/entidad/Usuario.entity';
import { UserService } from 'src/user/servicios/user.service';
import { CreateDeporteDTO } from '../dto/createDeporte.dto';
import { UpdateDeporteDTO } from '../dto/updateDeporte.dto';

import { Deporte } from '../entidad/Deporte.entity';
import { Deportista } from 'src/deportista/entidad/deportista.entity';

@Injectable()
export class DeporteService {
    constructor(
        @InjectRepository(Deporte)
        private deporteRepo: Repository<Deporte>,
        @InjectRepository(Deportista)
        private deportistaRepo: Repository<Deportista>,
        @InjectRepository(Usuario)
        private userRepo: Repository<Usuario>,
        private userService: UserService,
        private dataSource: DataSource
        
    ){}

    async getDeportes(){
        const res= await this.deporteRepo.find({relations:['capitan','deportistas']})
        
        if(res.length == 0) throw new NotFoundException('na hay deportes')

        
        return res
    }

    async create(body: CreateDeporteDTO){
        const value={
            capacidad: body.capacidad,
            deporte: body.deporte,
            medalla: body.medalla,
            sexo: body.sexo,
            capitan: null            
        }
        if(body.user_capitan){
            
            const depo= await this.deportistaRepo
                        .findOne({where:{usuario: {usuario: body.user_capitan}, deporte:{deporte: body.deporte} }})
            if(!depo) throw new NotFoundException('no existe el deportista')

            value.capitan=depo
        }
        

                    
        
        const g= await this.deporteRepo.create(value)
        await this.deporteRepo.save(g)
        const res= await this.deporteRepo.findOne({where: {deporte: value.deporte}, relations: ['capitan']})

        return {message:'deporte creado',res}
    }



    async buscaId(id: number){
        const res= await this.deporteRepo.findOne({where: {id_deporte: id}})
        if(!res)throw new NotFoundException('no existe el deporte')
        
        return res
    }


    async update(id: number, body: UpdateDeporteDTO){
        const value={
            capacidad: body.capacidad,
            deporte: body.deporte,
            medalla: body.medalla,
            sexo: body.sexo,
            capitan: null            
        }
        if(body.user_capitan){
            const depo= await this.deportistaRepo
            .findOne({where:{usuario: {usuario: body.user_capitan}, deporte:{deporte: body.deporte} }})
            if(!depo) throw new NotFoundException('no existe el deportista')

            value.capitan=depo 
        }
        const verificaDepo= this.buscaId(id)

        const res = await this.deporteRepo.update(id, value)
        
        return {message:'deporte modificado',res}
    }


    async delete(id: number){
        const verificaDepo= this.buscaId(id)
        const res= await this.deporteRepo.delete(id)        
        return {message:'deporte eliminado',res}
    }




}
