import { injectable } from "@deepkit/injector";

interface TemplateConfig {
	moduleScripts: string[];
	pageTitle: string;
	pageData: any;
	scripts: string[];
	styleSheets: string[];
}

function getFullTemplateConfig(partialConfig: Partial<TemplateConfig>): TemplateConfig {
	return {
		moduleScripts: partialConfig.moduleScripts ?? [],
		pageTitle: partialConfig.pageTitle ?? "The Broom Stack",
		pageData: partialConfig.pageData,
		scripts: partialConfig.scripts ?? [],
		styleSheets: partialConfig.styleSheets ?? [],
	};
}

@injectable()
export class FrontendService {
	constructor() {}

	public renderAppTemplate(_templateConfig: Partial<TemplateConfig>) {
		const templateConfig = getFullTemplateConfig(_templateConfig);
		return (
			<html lang="en" class="no-js">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />

					<title>{templateConfig.pageTitle}</title>

					<script type="module">
						document.documentElement.classList.remove("no-js");
						document.documentElement.classList.add("js");
					</script>

					{templateConfig.styleSheets.map((s) => (
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
					{templateConfig.pageData && (
						<script>window.__pageData = JSON.stringify(templateConfig.pageData);</script>
					)}
				</head>

				<body>
					<div id="root"></div>
					{templateConfig.moduleScripts.map((s) => (
						<script src={s} type="module"></script>
					))}
					{templateConfig.scripts.map((s) => (
						<script src={s}></script>
					))}
				</body>
			</html>
		);
	}
}
