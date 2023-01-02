import React, { useState } from "react";

import ErrorMessage from "./Messages/ErrorMessage";
import SuccessMessage from "./Messages/SuccessMessage";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                hashed_password: password,
                name: name,
                surname: surname,
            }),
        };


        const response = await fetch("/api/register", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            // Show a success message
            setSuccessMessage("Registration successful");
            resetForm();
            // Wait 5 seconds and then redirect to login page
            setTimeout(() => {
                window.location.href = "/login";
            }, 5000);

        };

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmPassword && password.length >= 8) {
            submitRegistration();
        }
        else {
            setErrorMessage(
                "Passwords do not match or are too short (minimum 8 characters)"
            );
        };
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setSurname("");
        setErrorMessage("");
        setSuccessMessage("");
    };

    return (
        <div className="column">
            <form className="box" onSubmit={ handleSubmit }>
                <h1 className="title has-text-centered">Register</h1>
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
                <div className="field">
                    <label className="label">
                        Confirm password
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="password"
                            placeholder="P@ssw0rd"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Name
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="name"
                            placeholder="Your name"
                            value={name} onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">
                        Surname
                    </label>
                    <div className="control">
                        <input
                            className="input"
                            type="surname"
                            placeholder="Your surname"
                            value={surname} onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <ErrorMessage errorMessage={errorMessage} />
                <SuccessMessage successMessage={successMessage} />
                <br />
                <button className="button is-primary" type="submit">
                    Register
                </button>
                <button className="button is-secondary" type="reset" onClick={() => resetForm()}>
                    Reset
                </button>
            </form>
        </div>
    )
};

export default Register;
