import { AutoIncrement, entity, PrimaryKey, Reference } from "@deepkit/type";
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

@(entity.name("match").collection("matches"))
export class Match implements IDataObject {
	public id: number & PrimaryKey & AutoIncrement = 0;
	public created: Date = new Date();
	public modified?: Date;

	public state?: string;

	public draw?: Draw & Reference;
	public sheet?: Sheet & Reference;
	public team1?: Team & Reference;
	public team2?: Team & Reference;

	constructor(public date: Date) {}

	public getState(): GameState {
		return this.state && JSON.parse(this.state);
	}
}
