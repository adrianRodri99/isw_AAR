/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';


import { CreateDeportistaDTO } from '../dto/createDeportista.dto';
import { Deportista } from '../entidad/deportista.entity';
import { Deporte } from 'src/deporte/entidad/Deporte.entity';
import { Usuario } from 'src/user/entidad/Usuario.entity';
import { EliminarDTO } from '../dto/eliminarDTO';


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

    async getOne(id: number){
        
        const res= await this.deportistaRepo.findOne({where: {id_deportista: id}})
        if(!res) throw new NotFoundException('no existe el deportista')
        return res
    }

    async create(body: CreateDeportistaDTO, userRT: Usuario){

        const user= await this.userRepo.findOne({where: {usuario: body.usuario}})
        const sport= await this.deporteRepo.findOne({where: {deporte: body.deporte},relations:['deportistas']})
       
        if(!user) throw new NotFoundException('No existe el usuario, registrate')
        if(user.usuario != userRT.usuario) throw new UnauthorizedException('no puede inscribir a otros usuarios')
        const comparaPassword= await compare(body.password, userRT.password)
        if(!comparaPassword)throw new UnauthorizedException('Contraseñas incorrectas')
        if(!sport)throw new NotFoundException('No existe el deporte')
        if(sport.deportistas.length == sport.capacidad)throw new InternalServerErrorException('no hay capacidad en el deporte') 

        //si ya existe el deportista
        const dep= await this.deportistaRepo.findOne({where: {usuario: {id_user: user.id_user}}, relations:['deporte']})
        if(dep){
            const arrayDeportes: Deporte[]=[]
            dep.deporte.forEach(e=> arrayDeportes.push(e))  //dep.deporte
            arrayDeportes.push(sport);
            dep.deporte= arrayDeportes
            const res=await this.deportistaRepo.save(dep)
            return {message: "deportista actualizado", res}
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

        return {message: "deportista creado", res}
    }

    //no actualizo al deportista porque sus propiedades pertenecen a otra entidad
    async update(id: number){
        const res= ''+id
        return res

    }

    async delete(id: number, userRT?: Usuario){
        if(userRT){
            const verifica= await this.deportistaRepo.findOne({where: {id_deportista: id }, relations: ['usuario'] })
            if(!verifica) throw new NotFoundException('no existe el deportista')

            if(verifica.usuario.usuario != userRT.usuario) throw new UnauthorizedException('no puede eliminar a otros usuarios')
        }
        
        const res= await this.deportistaRepo.delete(id)        
        return {message:'deportista eliminado',res}
    }

    
    async deleteDeporte(id: number, deport: EliminarDTO, userRT?: Usuario){
        
        const verifica1= await this.deportistaRepo.findOne({where: {id_deportista: id }, relations: ['usuario'] })
        if(!verifica1) throw new NotFoundException('no existe el deportista')
        if(userRT != undefined){  
            const esCapi = await this.compararCapitan(deport.deporte, userRT) 
            if(
                verifica1.usuario.usuario != userRT?.usuario &&
                !esCapi    
            ) throw new UnauthorizedException('no tiene permiso para eliminar a otros usuarios')
        }
                
        const res= await this.deportistaRepo.findOne({where: {id_deportista: id }, relations: ['deporte'] })
        if(!res) throw new NotFoundException('no existe el deportista')       
        
        const sport= await this.deporteRepo.findOne({where: {deporte: deport.deporte}})
        if(!sport) throw new NotFoundException('no existe el deporte')
        const verifica = res.deporte.filter((e)=> e.id_deporte == sport.id_deporte )
        
        if(verifica.length < 1 ) throw new NotFoundException('el deportista no participa en ese deporte')

        //verifica si el registrado(userRT) es capitan de ese deporte para eliminar
        //if(!this.compararCapitan(deport.deporte, userRT)) throw new ForbiddenException('no tienes permisos para eliminar a otro deportista')    


        if(res.deporte.length==1){return this.delete(id)}//si el deportista tiene un solo deporte elimino lo completo

        res.deporte = res.deporte.filter((d)=> { return d.id_deporte !== sport.id_deporte})

        await this.deportistaRepo.save(res)
        
        return {message:'deportista eliminado del deporte',res}
    }

    async compararCapitan(deporte: string, userRT: Usuario){//para saber si puede eliminara ya que solo los capitanes pueden elininar en su deporte
        const sport= await this.deporteRepo.findOne({where: {deporte: deporte}})
       
        if(!sport)throw new NotFoundException('no existe el deporte')
        if(sport.capitan == null)throw new NotFoundException('no existe capitan en el deporte')
        if(sport.capitan.usuario.id_user == userRT.id_user ){
            return true
        }

        return false
    }

}
