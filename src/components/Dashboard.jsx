import React, { useContext } from "react";
import moment from "moment";

import ErrorMessage from "./Messages/ErrorMessage";
import SuccessMessage from "./Messages/SuccessMessage";

import { UserContext } from "../context/UserContext";

const Dashboard = () => {
    const [token] = useContext(UserContext);
    const [dashboard, setDashboard] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    
};
