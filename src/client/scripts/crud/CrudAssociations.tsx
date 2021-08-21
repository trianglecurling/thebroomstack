import { DetailsList, mergeStyles, SelectionMode } from "@fluentui/react";
import { useMemo } from "react";
import { EntityData, PluralizationMap } from "../../../../@types/app/shared";
import { Link } from "../common/Link";
import { usePageData } from "../hooks/usePageData";

export const CrudAssociations: React.FC<{}> = () => {
    const entity = usePageData<EntityData>("entity");
    const pluralizationMap = usePageData<PluralizationMap>("pluralizationMap");
	//const associations = usePageData<any[]>("associations");
	const noBottomMargin = mergeStyles({ marginBottom: 0 });
    const associations = useMemo(() => {
        const uniqueAssoc = new Set<string>(entity.associations.map(a => a.name));
        return [...uniqueAssoc];
    }, [entity.associations]);
	return (
		<div>
			<h2 className={noBottomMargin}>{entity.name} associations</h2>
			<DetailsList
				items={associations}
				selectionMode={SelectionMode.none}
				compact={true}
				columns={[
					{
						key: "name",
						name: "Model",
						minWidth: 175,
						maxWidth: 175,
						onRender: (item) => <Link href={`/crud/${pluralizationMap.toPlural[item]}`}>{item}</Link>,
					},
				]}
			/>
		</div>
	);
};
