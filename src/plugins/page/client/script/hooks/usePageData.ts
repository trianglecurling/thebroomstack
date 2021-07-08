declare global {
	interface Window {
		__pageData: any;
	}
}

export function usePageData<T>(key: string): T {
	const result = window.__pageData[key];
	if (!result) {
		throw new Error(`Could not find ${key} on __pageData.`);
	}
	return result as T;
}
