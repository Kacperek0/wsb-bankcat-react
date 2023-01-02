import React from "react";

import { UserContext } from "../context/UserContext";

const Navbar = () => {
    const [token, setToken] = React.useContext(UserContext);

    const logout = () => {
        setToken(null);
        localStorage.removeItem("bankcatToken");
        window.location.href = "/";
    };

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
                </a>
            </div>
            {token ? (
                <div className="navbar-menu">
                    <div className="navbar-start">
                        <a className="navbar-item" href="/import-data">
                            Import Data
                        </a>
                        <a className="navbar-item" href="/categories">
                            Categories
                        </a>
                        <a className="navbar-item" href="/savings">
                            Savings
                        </a>
                        <a className="navbar-item" href="/spendings">
                            Spendings
                        </a>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <button className="button is-danger" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="navbar-menu">
                    <div className="navbar-start">
                        <a className="navbar-item" href="/about">
                            About
                        </a>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <a className="button is-primary" href="/login">
                                    <strong>Login</strong>
                                </a>
                                <a className="button is-light" href="/register">
                                    Register
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
