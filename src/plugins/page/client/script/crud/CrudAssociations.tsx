import {
	DetailsList,
	mergeStyles,
	SelectionMode,
} from "@fluentui/react";
import { Link } from "../Link";
import { usePageData } from "../hooks/usePageData";

export const CrudAssociations: React.FC<{}> = () => {
    const modelName = usePageData<string>("modelName");
	const associations = usePageData<any[]>("associations");
	const noBottomMargin = mergeStyles({ marginBottom: 0 });
	return (
		<div>
			<h2 className={noBottomMargin}>{modelName} associations</h2>
			<DetailsList
				items={associations}
				selectionMode={SelectionMode.none}
				compact={true}
				columns={[
					{
						key: "model",
						name: "Model",
						isRowHeader: true,
						minWidth: 175,
                        maxWidth: 175,
						fieldName: "as",
						onRender: (item) => (
							<Link href={`/crud/${item.as}`}>{item.as}</Link>
						),
					},
					{
						key: "type",
						name: "Type",
						minWidth: 175,
                        maxWidth: 175,
						fieldName: "associationType",
					},
					{
						key: "fk",
						name: "Foreign key",
						minWidth: 175,
                        maxWidth: 175,
						fieldName: "foreignKey",
					},
					{
						key: "joinTable",
						name: "Join table",
						minWidth: 175,
                        maxWidth: 175,
						fieldName: "through",
                        onRender: (item) => (
							item.through && <Link href={`/crud/${item.through}`}>{item.through}</Link>
						),
					},
				]}
			/>
		</div>
	);
};
