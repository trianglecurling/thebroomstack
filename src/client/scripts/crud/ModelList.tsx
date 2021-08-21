import { Entities, PluralizationMap } from "../../../../@types/app/shared";
import { usePageData } from "../hooks/usePageData";
import { useNavigate } from "@reach/router";
import { Nav, INavLinkGroup, INavLink } from "@fluentui/react/lib/Nav";
import React from "react";
import { useCallback } from "react";

export const ModelList: React.FC<{}> = () => {
	const entities = usePageData<Entities>("entities");
	const pluralizationMap = usePageData<PluralizationMap>("pluralizationMap");
	const navigate = useNavigate();
	const onLinkClick = useCallback(
		(event?: React.MouseEvent<HTMLElement>, link?: INavLink) => {
			event?.preventDefault();
			navigate(link?.url ?? "#");
		},
		[navigate]
	);
	const navLinkGroups: INavLinkGroup[] = [
		{
			name: "Models",
			links: entities.map((m) => ({
				key: m.name,
				name: m.name,
				url: `/crud/${pluralizationMap.toPlural[m.name]}`,
			})),
		},
	];
	console.log("Nav render");
	return <Nav groups={navLinkGroups} onLinkClick={onLinkClick} />;
};
ModelList.displayName = "ModelList";
