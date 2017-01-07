import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import About from "./components/routes/home/about";
import App from "./components/routes/index";
import HomeIndex from "./components/routes/home/index";
import User from "./components/user";

export default (
	<Route path="/" component={App}>
		<IndexRoute component={HomeIndex} />
		<Route path="/about" component={About} />
		<Route path="/user/:id" component={User} />
	</Route>
);
