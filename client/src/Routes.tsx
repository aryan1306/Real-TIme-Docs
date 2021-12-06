import React from "react";
import { nanoid } from "nanoid";
import {
	BrowserRouter as Router,
	Route,
	Navigate,
	Routes as Switch,
} from "react-router-dom";
import TextEditor from "./TextEditor";

const Routes: React.FC = () => {
	return (
		<Router>
			<Switch>
				<Route path='/' element={<Navigate to={`/documents/${nanoid()}`} />} />
				<Route path='/documents/:id' element={<TextEditor />} />
			</Switch>
		</Router>
	);
};

export default Routes;
