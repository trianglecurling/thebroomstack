import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode } from "@fluentui/react";
import { usePageData } from "../hooks/usePageData";

export const CrudList: React.FC<{}> = () => {
	const modelNamePlural = usePageData<string>("modelNamePlural");
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
		minWidth: name === "id" ? 25 : 100,
		fieldName: name,

	}));
	return (
		<div>
			<h2>{modelNamePlural} list</h2>
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
