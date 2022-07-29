/* eslint-disable prettier/prettier */

import { RolesBuilder } from "nest-access-control";

export enum AppRoles{
    USUARIO = 'usuario',
    ADMIN = 'admin',
    CAPITAN = 'capitan'
}

export enum AppRecursos{
    USER= 'USER',
    DEPORTISTA= 'DEPORTISTA',
    DEPORTE='DEPORTE'
}

export const rol: RolesBuilder= new RolesBuilder()

rol
    // usuario roles
    .grant(AppRoles.USUARIO)
    .updateOwn([AppRecursos.USER])
    .deleteOwn([AppRecursos.USER])
    .createOwn([AppRecursos.DEPORTISTA])
    .deleteOwn([AppRecursos.DEPORTISTA])
    
    //admin roles
    .grant(AppRoles.ADMIN)
    .extend(AppRoles.USUARIO)
    .createAny([AppRecursos.USER,AppRecursos.DEPORTE])
    .updateAny([AppRecursos.USER,AppRecursos.DEPORTISTA,AppRecursos.DEPORTE])
    .deleteAny([AppRecursos.USER,AppRecursos.DEPORTISTA,AppRecursos.DEPORTE])
    
    //creo q este rol no debe estar
    // //capitan roles
    // .grant(AppRoles.CAPITAN)
    // .extend(AppRoles.USUARIO)
    // .updateAny([AppRecursos.DEPORTISTA])
    // .deleteAny([AppRecursos.DEPORTISTA])
    

