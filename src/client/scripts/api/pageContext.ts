import { IPageContext } from "../../../../@types/app/shared";

export async function getPageContext(): Promise<IPageContext> {
	const result = await fetch(window.location.href, { headers: { Accept: "application/json" } });
	return result.json();
}
