import { RouteComponentProps } from "@reach/router";
import { usePageData } from "../hooks/usePageData";
import { CrudAssociations } from "./CrudAssociations";
import { CrudList } from "./CrudList";
import { EntityData, PluralizationMap } from "../../../types/shared";

export const CrudIndex: React.FC<RouteComponentProps> = () => {
	const entity = usePageData<EntityData>("entity");
	const pluralizationMap = usePageData<PluralizationMap>("pluralizationMap");
	return (
		<div>
			<h1>{pluralizationMap.toPlural[entity.name]} index</h1>
			<CrudAssociations />
			<CrudList />
		</div>
	);
};
