import { Router } from "@reach/router";
import {CrudIndex} from "./CrudIndex"

export const CrudMain: React.FC<{}> = () => {
    return <Router>
        <CrudIndex path="/crud/:model" />
    </Router>
}