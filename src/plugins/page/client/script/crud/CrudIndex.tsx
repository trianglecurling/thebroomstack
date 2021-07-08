import { Router } from "@reach/router";
import { RouteComponentProps } from "@reach/router";
import { usePageData } from "../hooks/usePageData";
import { CrudAssociations } from "./CrudAssociations";
import { CrudList } from "./CrudList";

export const CrudIndex: React.FC<RouteComponentProps> = () => {
	const modelNamePlural = usePageData<string>("modelNamePlural");
	return (
		<div>
			<h1>{modelNamePlural} index</h1>
			<CrudAssociations />
			<CrudList />
		</div>
	);
};
