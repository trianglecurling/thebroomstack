import React from "react";
import { CrudNav } from "./crud/CrudNav";
import { Router } from "@reach/router";
import { Stack, Text, mergeStyles, useTheme } from "@fluentui/react";

// This component uses `function` syntax to ensure the function
// object has a set `.name` property, which is used as a heuristic
// by HMR to decide the react boundary.
export const App: React.FC<{}> = function App() {
	const theme = useTheme();
	return (
		<div>
			<Stack>
				<Stack.Item
					style={{ backgroundColor: theme.palette.themePrimary }}
				>
					<Text variant="xxLarge">The Broom Stack</Text>
				</Stack.Item>
				<Stack.Item grow>
					<Stack horizontal tokens={{ childrenGap: 8 }}>
						<Stack.Item>
							<Router>
								<CrudNav path="/crud/*" />
							</Router>
						</Stack.Item>
						<Stack.Item>Other stuff</Stack.Item>
					</Stack>
				</Stack.Item>
			</Stack>
		</div>
	);
};
