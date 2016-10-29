import * as React from "react";

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
		let contents: JSX.Element;
		if (this.props.childItems) {
			contents = (
				<div>
					<span>{this.props.label}</span>
					<NavigationList items={this.props.childItems} />
				</div>
			);
		} else {
			contents = <a href={this.props.uri}>{this.props.label}</a>;
		}
		return (
			<li className={this.props.selected ? "selected" : ""}>
				{contents}
			</li>
		);
	}
}
