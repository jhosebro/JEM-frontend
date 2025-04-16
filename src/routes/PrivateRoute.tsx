import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { JSX } from "react";

type Props = {
    children: JSX.Element;
}

const PrivateRoute = ({children}: Props) => {
    const { user, loading } = useAuth();

    if(loading) return null;

    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute