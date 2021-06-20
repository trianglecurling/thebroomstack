import { FastifyPluginAsync } from "fastify";
import { User, Address } from "../../schema";

export const ApiPlugin: FastifyPluginAsync = async (fastify, opts) => {
	fastify.addHook("onRequest", async (request, reply) => {
		request.isApiRequest = true;
	});

	fastify.get("/user", async (request, reply) => {
		//User.destroy({ truncate: true });
		const user = User.build(
			{
				fullName: "John Smith",
				friendlyName: "Jack",
				ccmUserName: "jsjack",
				email: "john@smith.com",
				memberSince: new Date(2015, 8, 1),
				curledSince: new Date(2015, 8, 1),
				dateOfBirth: new Date(1984, 6, 24),
				phone: "2813775337",
				gender: "male",
				occupation: "Software Engineer",
				Address: {
					line1: "123 Anywhere St",
					city: "Raleigh",
					state: "NC",
					zip: "27626",
				},
			},
			{ include: [Address] }
		);
		await user.save();
		return { test: "foo!" };
	});
};
