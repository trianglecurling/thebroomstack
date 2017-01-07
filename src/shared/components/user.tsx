import * as React from "react";

interface State {}
interface Props {
	params: {[key: string]: string}
}

export default class User extends React.Component<Props, State> {
	public render() {
		return <div>User page for {this.props.params["id"]}</div>;
	}
}
