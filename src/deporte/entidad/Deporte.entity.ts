/* eslint-disable prettier/prettier */

import { Exclude } from "class-transformer";
import { Deportista } from "src/deportista/entidad/deportista.entity";
import { Usuario } from "src/user/entidad/Usuario.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn,  } from "typeorm";

@Entity('deporte')
export class Deporte{

    @PrimaryGeneratedColumn()
    id_deporte: number  

    @Column({unique: true})
    deporte: string

    @Column()
    capacidad: number

    @Column({nullable: true})
    medalla: string

    @Column()
    sexo: string


    @ManyToOne(()=> Deportista,{eager: true, nullable: true, onDelete: 'SET NULL', })
    @JoinColumn({name: 'capitan'})
    capitan: Deportista

    @ManyToMany(()=>Deportista, deportistas=> deportistas.deporte,
        {nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE', })
    @JoinTable()
    deportistas: Deportista[]

}

