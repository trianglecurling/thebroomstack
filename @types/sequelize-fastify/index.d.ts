declare module "sequelize-fastify" {
	import { Options as SequelizeOptions, Sequelize} from "sequelize";
	import type { FastifyPluginCallback } from "fastify";
    
    declare module "fastify" {
        interface FastifyInstance {
            sequelize: Sequelize
        }
    }
    
    const instance: FastifyPluginCallback<{
        instance?: "sequelize";
        sequelizeOptions: SequelizeOptions;
    }>;
	export default instance;
}

