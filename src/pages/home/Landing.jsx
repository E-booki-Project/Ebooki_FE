import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/authStorage";
import LoggedOut from "../../components/LoggedOut";

function Landing() {
    if (isLoggedIn()) return <Navigate to="/home" replace />;
    return <LoggedOut />;
}

export default Landing;
