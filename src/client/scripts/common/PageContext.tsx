import { globalHistory } from "@reach/router";
import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getPageContext } from "../api/pageContext";
import { IPageContext } from "../../../types/shared";

declare global {
	interface Window {
		__pageContext: IPageContext;
	}
}

const defaultPageContext = {
	moduleScripts: [],
	pageData: {},
	pageTitle: "The Broom Stack",
	scripts: [],
	styleSheets: [],
};

const PageContext = createContext<IPageContext>(defaultPageContext);

export function usePageContext() {
	return useContext(PageContext);
}

export const PageContextProvider: React.FC<unknown> = ({ children }) => {
    const queryClient = useQueryClient();
	const pageContextQuery = useQuery(["page-context"], getPageContext, {
		initialData: window.__pageContext,
		staleTime: Infinity,
	});
	useEffect(() => {
		return globalHistory.listen(() => {
            queryClient.invalidateQueries();
		});
	}, []);
	return <PageContext.Provider value={pageContextQuery.data ?? defaultPageContext}>{children}</PageContext.Provider>;
};
