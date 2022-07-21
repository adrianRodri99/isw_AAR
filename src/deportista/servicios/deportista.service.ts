/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';


import { CreateDeportistaDTO } from '../dto/createDeportista.dto';
import { Deportista } from '../entidad/deportista.entity';
import { Deporte } from 'src/deporte/entidad/Deporte.entity';
import { Usuario } from 'src/user/entidad/Usuario.entity';


@Injectable()
export class DeportistaService {
    
    constructor(
        @InjectRepository(Deportista)
        private deportistaRepo: Repository <Deportista>,
        
        @InjectRepository(Deporte)
        private deporteRepo: Repository <Deporte>,
        
        @InjectRepository(Usuario)
        private userRepo: Repository <Usuario>,
    ){}


    async getAll(){

        const res= await this.deportistaRepo.find({relations: ['usuario', 'deporte']})
        if(res.length == 0) throw new NotFoundException('no hay deportistas')
        return res
    }

    // async getOne(id: number){
        
    //     const res= await this.deportistaRepo.findOne({where: {id: id}})
    //     if(!res) throw new NotFoundException('no existe el deportista')
    //     return res
    // }

    async create(body: CreateDeportistaDTO, userRT: Usuario){

        const user= await this.userRepo.findOne({where: {usuario: body.usuario}})
        const sport= await this.deporteRepo.findOne({where: {deporte: body.deporte}})
        // console.log(user)
        // console.log(userRT)
        if(!user) throw new NotFoundException('No existe el usuario, registrate')
        if(user.usuario != userRT.usuario) throw new UnauthorizedException('no puede inscribir a otros usuarios')
        const comparaPassword= await compare(body.password, userRT.password)
        if(!comparaPassword)throw new UnauthorizedException('Contraseñas incorrectas')
        if(!sport)throw new NotFoundException('No existe el deporte')

        //si ya existe el deportista
        const dep= await this.deportistaRepo.findOne({where: {usuario: {id_user: user.id_user}}, relations:['deporte']})
        console.log(dep)
        if(dep){
            const arrayDeportes: Deporte[]=[]
            dep.deporte.forEach(e=> arrayDeportes.push(e))  //dep.deporte
            arrayDeportes.push(sport);
            dep.deporte= arrayDeportes
            return await this.deportistaRepo.save(dep)
        }

        //si no existe
        const value= {
            grupo: body.grupo,
            usuario: user,
            deporte: undefined 
        };       

        const g= await this.deportistaRepo.create(value)//creo el deportista para despues save
        g.deporte= [sport]// agrego el deporte

        const arrayDeportistas: Deportista[]=[]      //sport.deportistas
        
        arrayDeportistas.push(g)
        sport.deportistas= arrayDeportistas
        
        
        

        const save= await this.deportistaRepo.save(g)
        await this.deporteRepo.save(sport)
        const res= await this.deportistaRepo.findOne({where: {id_deportista: g.id_deportista}, relations:['usuario', 'deporte']})

        return res
    }

    async update(id: number){
        const res= ''+id
        return res

    }

    async delete(id: number){
        const res= await this.deportistaRepo.delete(id)        
        return {message:'deportista eliminado',res}
    }



}
