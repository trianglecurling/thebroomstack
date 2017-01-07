import * as React from "react";

import { Link } from 'react-router'

export interface NavigationItem {
	id: string;
	label: string;
	selected?: boolean;
	uri?: string;
	childItems?: NavigationItem[];
}

export class Navigation extends React.Component<{items: NavigationItem[]}, {}> {
	public render() {
		return (
			<nav>
				<NavigationList items={this.props.items} />
			</nav>
		);
	}
}

export class NavigationList extends React.Component<{items: NavigationItem[]}, {}> {
	public render() {
		return (
			<ul>
				{this.props.items.map(i => <NavigationItem {...i} key={i.id} />)}
			</ul>
		);
	}
}

export class NavigationItem extends React.Component<NavigationItem, {selected: boolean}> {
	public render() {
		let label = <span className="link-no-ref">{this.props.label}</span>;
		let text = label;

		if (this.props.uri) {
			text = <Link to={this.props.uri} activeClassName="selected" onlyActiveOnIndex={true}>{label}</Link>;
		}

		let contents = text;
		if (this.props.childItems) {
			contents = (
				<div>
					{text}
					<NavigationList items={this.props.childItems} />
				</div>
			);
		}
		return (
			<li className={this.props.selected ? "selected" : ""}>
				{contents}
			</li>
		);
	}
}
