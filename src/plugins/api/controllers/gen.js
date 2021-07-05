
const template = `import { FastifyPluginAsync } from "fastify";
import { [[singular]] } from "../../../dataModel/[[singular]]";
import { CrudComponent } from "../components/crudComponent";

export const [[plural]]Controller: FastifyPluginAsync = async (fastify, opts) => {
	fastify.register(CrudComponent, { entityName: "[[singular-lc]]" });
};
`;

const toGenerate = [
  "User",
  "Address",
  "EmergencyContact",
  "ParentContact",
  "DrawTime",
  "Invoice",
  "Match",
  "Team",
  "Sheet",
  "Player",
  "Club",
  "UserParentContact",
  "LeagueMembership",
  "SpareCandidate",
  "LeagueTeam",
  "PlayerClub",
];

const fs = require("fs/promises");
const path = require("path");

async function go() {
  for (const gen of toGenerate) {
    const singular = gen;
    const plural = gen + "s";
    const singularLc = gen.toLowerCase();
    const content = template
      .replace(/\[\[singular\]\]/g, singular)
      .replace(/\[\[plural\]\]/g, plural)
      .replace(/\[\[singular-lc\]\]/g, singularLc);
    await fs.writeFile(path.join(__dirname, singularLc + "sController.ts"), content, "utf-8");
  }
}
go().then(() => console.log("done"));
