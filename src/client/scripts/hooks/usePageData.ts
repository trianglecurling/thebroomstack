import { usePageContext } from "../common/PageContext";

export function usePageData<T>(key: string): T {
    const pageContext = usePageContext();
	const result = pageContext.pageData[key];
	if (!result) {
		throw new Error(`Could not find ${key} on __pageData.`);
	}
	return result as T;
}