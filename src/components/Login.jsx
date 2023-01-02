import React, { useState, useContext } from "react";

import ErrorMessage from "./Messages/ErrorMessage";
import SuccessMessage from "./Messages/SuccessMessage";

import { UserContext } from "../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [, setToken] = useContext(UserContext);

    const submitLogin = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`)
        };

        const response = await fetch("/api/login", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            // Clear the error message
            setErrorMessage("");
            setSuccessMessage("Login successful");
            setToken(data.access_token);
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    };

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Login</h1>
                <div className="field">
                    <label className="label">
                        Email Address
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="email"
                            placeholder="Email Address"
                            value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Password
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="password"
                            placeholder="P@ssw0rd"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <ErrorMessage errorMessage={errorMessage} />
                <SuccessMessage successMessage={successMessage} />
                <br />
                <button className="button is-primary" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
