import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode } from "@fluentui/react";
import { EntityData, PluralizationMap } from "../../../../@types/app/shared";
import { usePageData } from "../hooks/usePageData";
import { Link } from "../common/Link";

export const CrudList: React.FC<{}> = () => {
	const entity = usePageData<EntityData>("entity");
	const pluralizationMap = usePageData<PluralizationMap>("pluralizationMap");
	const items = usePageData<any[]>("items");
	const columnNames = new Set<string>();
	for (const item of items) {
		for (const k of Object.keys(item)) {
			columnNames.add(k);
		}
	}
	const columns: IColumn[] = Array.from(columnNames).map((name) => ({
		key: name,
		name: name,
		isRowHeader: false,
        isResizable: true,
		minWidth: name === "id" ? 25 : 100,
		fieldName: name,
		onRender: (item) => {
			return typeof item[name] === "object" ? (
				item.id != null ? (
					<Link href={`/crud/${pluralizationMap.toPlural[name]}/${item.id}`}>
						ref: {item.id}
					</Link>
				) : (
					String(item)
				)
			) : (
				item[name]
			);
		},
	}));
	return (
		<div>
			<h2>{pluralizationMap.toPlural[entity.name]} list</h2>
			<DetailsList
				items={items}
				selectionMode={SelectionMode.multiple}
				compact={true}
				columns={columns}
				layoutMode={DetailsListLayoutMode.fixedColumns}
			/>
		</div>
	);
};
