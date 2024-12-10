import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
	children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const isAuthenticated = !!localStorage.getItem("authToken"); // Ou use o contexto adequado

	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
