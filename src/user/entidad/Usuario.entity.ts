/* eslint-disable prettier/prettier */

import { hash } from "bcrypt";
import * as bcrypt from "bcrypt"
import { BeforeInsert, BeforeUpdate, Column, Entity,  ManyToOne,  OneToMany,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Deporte } from "src/deporte/entidad/Deporte.entity";
import { Deportista } from "src/deportista/entidad/deportista.entity";

@Entity('usuario')
export class Usuario{
    
    
    @PrimaryGeneratedColumn()
    id_user: number;
    
    
    @Column({unique: true, nullable: false})
    usuario: string

    
    @Column({ nullable: false})
    @Exclude({toPlainOnly: true})
    password: string

    
    @Column()
    name: string

    //conexion con los deporte
    //@OneToMany(()=>Deporte, deporte=>deporte.capitan)

    //conexion con los deportistas
    @OneToOne(()=>Deportista)


    
    @Column({ type: 'simple-array', nullable:true, default:'usuario'})
    roles: string[]

    //no me funciona pero lo valide en el servicio--------------------------------------
    //xq no se ejecuta el before
    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword(){
        console.log('llegue al hash')
        if(!this.password){
            return;
        }
        this.password = await hash(this.password, 10) 
    } 

    // @BeforeInsert()
    // @BeforeUpdate()
    // async hashPassword(){
    //     const salt = await bcrypt.genSalt()
    //     this.password = await bcrypt.hash(this.password, salt)
    // }
}