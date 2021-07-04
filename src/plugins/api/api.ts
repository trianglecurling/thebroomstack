import { FastifyPluginAsync } from "fastify";
import { Address } from "../../dataModel/Address";
// import { User, Address } from "../../schema";
import { User } from "../../dataModel/User";
import { SeasonsController } from "./controllers/seasonsController";

export const ApiPlugin: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("onRequest", async (request, reply) => {
		request.isApiRequest = true;
	});
	fastify.register(SeasonsController, { prefix: "seasons" });

	fastify.get("/user", async (request, reply) => {
		//User.destroy({ truncate: true });
		const user = new User(
			"John Smith",
			"Jack",
			"john@smith.com",
			new Date(2015, 8, 1),
			new Date(2015, 8, 1),
			new Date(1984, 6, 24),
			"123456789"
		);
		const address = new Address(
			"123 Anywhere St.",
			"Middletown",
			"Kansas",
			"62231"
		);
		address.line2 = "#234";
		user.address = address;
		user.ccmUserName = "jsjack";
		user.gender = "male";
		user.occupation = "Software engineer";
		await fastify.database.persist(user, address);
		reply.send({ success: "Success!" });

		// const user = User.build(
		// 	{
		// 		fullName: "John Smith",
		// 		friendlyName: "Jack",
		// 		ccmUserName: "jsjack",
		// 		email: "john@smith.com",
		// 		memberSince: new Date(2015, 8, 1),
		// 		curledSince: new Date(2015, 8, 1),
		// 		dateOfBirth: new Date(1984, 6, 24),
		// 		phone: "2813775337",
		// 		gender: "male",
		// 		occupation: "Software Engineer",
		// 		Address: {
		// 			line1: "123 Anywhere St",
		// 			city: "Raleigh",
		// 			state: "NC",
		// 			zip: "27626",
		// 		},
		// 	},
		// 	{ include: [Address] }
		// );
		// await user.save();
		// return { test: "foo!" };
	});
};
