import { HttpRequest } from "@deepkit/http";
import { IPageContext } from "../../types/shared";

function getFullTemplateConfig(partialConfig: Partial<IPageContext>): IPageContext {
	return {
		moduleScripts: partialConfig.moduleScripts ?? [],
		pageTitle: partialConfig.pageTitle ?? "The Broom Stack",
		pageData: partialConfig.pageData,
		scripts: partialConfig.scripts ?? [],
		styleSheets: partialConfig.styleSheets ?? [],
	};
}

function resolveScripts(scripts: string[]) {
	return scripts.map((s) => `/public/js/${s}`);
}

function resolveStyleSheets(styleSheets: string[]) {
	return styleSheets.map((ss) => `/public/css/${ss}`);
}

export class FrontendService {
	constructor(protected request: HttpRequest) {}

	public renderAppTemplate(_pageContext: Partial<IPageContext>) {
		const pageContext = getFullTemplateConfig(_pageContext);
		const scripts = resolveScripts(pageContext.scripts);
		const styleSheets = resolveStyleSheets(pageContext.styleSheets);

		if (this.request.headers.accept?.includes("application/json")) {
			return pageContext;
		} else {
			return (
				<html lang="en" class="no-js">
					<head>
						<meta charset="UTF-8" />
						<meta name="viewport" content="width=device-width, initial-scale=1" />

						<title>{pageContext.pageTitle}</title>

						<script type="module">
							document.documentElement.classList.remove("no-js");
							document.documentElement.classList.add("js");
						</script>

						{styleSheets.map((s) => (
							<link rel="stylesheet" href={s} />
						))}
						{/* <link rel="stylesheet" href="/assets/css/print.css" media="print" /> */}

						<meta name="description" content="Page description" />
						<meta property="og:title" content="Unique page title - My Site" />
						<meta property="og:description" content="Page description" />
						<meta property="og:image" content="https://www.mywebsite.com/image.jpg" />
						<meta property="og:image:alt" content="Image description" />
						<meta property="og:locale" content="en_GB" />
						<meta property="og:type" content="website" />
						<meta name="twitter:card" content="summary_large_image" />
						{/* <meta property="og:url" content="https://www.mywebsite.com/page" />
                            <link rel="canonical" href="https://www.mywebsite.com/page" /> */}

						<link rel="icon" href="/favicon.png" />
						{/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                            <link rel="manifest" href="/my.webmanifest" /> */}
						<meta name="theme-color" content="#ffffff" />
						<script>window.__pageContext = JSON.parse(`{JSON.stringify(pageContext)}`);</script>
					</head>

					<body>
						<div id="root"></div>
						{pageContext.moduleScripts.map((s) => (
							<script src={s} type="module"></script>
						))}
						{scripts.map((s) => (
							<script src={s}></script>
						))}
					</body>
				</html>
			);
		}
	}
}
