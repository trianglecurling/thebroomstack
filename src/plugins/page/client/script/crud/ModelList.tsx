import { usePageData } from "../hooks/usePageData";
import { useNavigate } from "@reach/router";
import { Nav, INavLinkGroup, INavLink } from "@fluentui/react/lib/Nav";
import React from "react";
import { useCallback } from "react";

export const ModelList: React.FC<{}> = () => {
	const models = usePageData<string[]>("models");
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
			links: models.map((m) => ({
				key: m,
				name: m,
				url: `/crud/${m}`,
			})),
		},
	];
	return <Nav groups={navLinkGroups} onLinkClick={onLinkClick} />;
};
