/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, JoinTable, ManyToMany,  OneToMany,  OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Usuario } from "src/user/entidad/Usuario.entity";
import { Deporte } from "src/deporte/entidad/Deporte.entity";


@Entity('deportista')
export class Deportista{

    @PrimaryGeneratedColumn()
    id_deportista: number;

    @Column()
    grupo: string;

    @OneToOne(()=>Usuario, {onDelete: 'CASCADE'})
    @JoinColumn()
    usuario: Usuario

    @OneToMany(()=>Deporte,deporte=>deporte.capitan)

    @ManyToMany(()=>Deporte, deporte=>deporte.deportistas, {onDelete:'CASCADE'})
    deporte: Deporte[]



    

}
    
