import React from "react";
import { CrudMain } from "./crud/CrudMain";
import { CrudNav } from "./crud/CrudNav";
import { Router } from "@reach/router";
import { Stack, Text, useTheme } from "@fluentui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools"
import { PageContextProvider } from "./common/PageContext";

const queryClient = new QueryClient();

// This component uses `function` syntax to ensure the function
// object has a set `.name` property, which is used as a heuristic
// by HMR to decide the react boundary.
export const App: React.FC<{}> = function App() {
	const theme = useTheme();
	return (
		<QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
			<PageContextProvider>
				<div>
					<Stack>
						<Stack.Item
							style={{
								backgroundColor: theme.palette.themePrimary,
								padding: "28px",
							}}
						>
							<Text style={{ color: theme.palette.white }} variant="xLarge">
								The Broom Stack
							</Text>
						</Stack.Item>
						<Stack.Item grow>
							<Stack horizontal tokens={{ childrenGap: theme.spacing.l2 }}>
								<Stack.Item
									style={{
										borderRight: `1px solid ${theme.semanticColors.bodyFrameDivider}`,
									}}
								>
									<Router>
										<CrudNav path="/crud/*" />
									</Router>
								</Stack.Item>
								<Stack.Item style={{ overflow: "auto" }}>
									<CrudMain />
								</Stack.Item>
							</Stack>
						</Stack.Item>
					</Stack>
				</div>
			</PageContextProvider>
		</QueryClientProvider>
	);
};
