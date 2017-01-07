import * as Navigation from "../navigation";
import * as React from "react";

export const NavigationData: Navigation.NavigationItem[] = require("../../data/navigation.json") as any;

interface State {}

interface Props {}

export default class HomeIndex extends React.Component<State, Props> {
	public render() {
		return (
			<div>
				<Navigation.Navigation items={NavigationData} />
				{this.props.children}
			</div>
		);
	}
}
