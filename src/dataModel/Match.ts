import { entity, t } from "@deepkit/type";
import { IDataObject } from "../types/data";
import { Draw } from "./Draw";
import { Sheet } from "./Sheet";
import { Team } from "./Team";

/**
 * Represents the point outcome of a single end
 */
export interface End {
	team1Points: number;
	team2Points: number;
}

/**
 * Represents the state of a curling game
 */
export interface GameState {
	/**
	 * Last Stone in First End.
	 * Which team started with hammer? 0 for top, 1 for bottom.
	 */
	LSFE?: 0 | 1;

	/**
	 * Ends that have been completed
	 */
	ends: End[];

	/**
	 * Signals that the game is over (may generate "X" markers on some variants)
	 */
	complete: boolean;
}

@(entity.name("match").collectionName("matches"))
export class Match implements IDataObject {
	@t.primary.autoIncrement public id: number = 0;
	@t public created: Date = new Date();
	@t public modified?: Date;

	@t public state?: string;

	@(t.type(() => Draw).reference()) public draw?: Draw;
	@(t.type(() => Sheet).reference()) public sheet?: Sheet;
	@(t.type(() => Team).reference()) public team1?: Team;
	@(t.type(() => Team).reference()) public team2?: Team;

	constructor(@t public date: Date) {}

	public getState(): GameState {
		return this.state && JSON.parse(this.state);
	}
}
