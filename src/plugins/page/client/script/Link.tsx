import { Link as FluentLink, ILinkProps } from "@fluentui/react";
import { useNavigate } from "@reach/router";
import React, { useCallback } from "react";

export const Link: React.FC<ILinkProps> = (props) => {
	const navigate = useNavigate();
	const onClick = useCallback((event: React.MouseEvent) => {
		if (props.href) {
            event.preventDefault();
			navigate(props.href);
		}
	}, [navigate]);
	return <FluentLink onClick={onClick} {...props} />;
};
