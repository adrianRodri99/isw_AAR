/* eslint-disable prettier/prettier */
/*
import { ConfigService } from "@nestjs/config";
import { getRepository } from "typeorm";

import { Usuario } from "src/user/entidad/Usuario.entity";
import { AppRoles } from "src/app.roles";
import { DEFAULT_USER, DEFAULT_USER_PASSWORD } from "./constans";

export const setUserDefalut = async (config: ConfigService) => {
    const userRepository = getRepository<Usuario>(Usuario)

    const defaultUser = await userRepository
            .createQueryBuilder()
            .where('usuario = :usuario', {usuario: config.get<string>(DEFAULT_USER)})
            .getOne
    if(!defaultUser){
        const adminUser= userRepository.create({
            usuario: config.get<string>(DEFAULT_USER),
            password: config.get<string>(DEFAULT_USER_PASSWORD),
            rol: AppRoles.ADMIN
        })
        return await userRepository.save(adminUser)
    }
}
*/