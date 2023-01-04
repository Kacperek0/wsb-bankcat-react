import React, { useState, useEffect } from "react";
import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

const BudgetsModal = ({
    active,
    handleModal,
    token,
    id,
    category_id,
    spendings,
    setErrorMessage,
    setSuccessMessage
}) => {
    const [budget, setBudget] = useState("");
    const [temporaryBudget, setTemporaryBudget] = useState("");

    useEffect(() => {
        const getBudgets = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            };
            const response = await fetch(`/api/budget/${id}`, requestOptions);

            if (!response.ok) {
                setErrorMessage("Somthing went wrong");
            }
            else {
                const data = await response.json();
                setTemporaryBudget((data.value / 100).toFixed(2));
            }
        };
        // console.log(id);
        if (id) {
            getBudgets();
        }
    }, [id, token]);


    const cleanForm = () => {
        setBudget("");
    };

    const handleCreateBudget = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                value: budget * 100,
                category_id: category_id,
                id: id
            })
        };

        const response = await fetch("/api/budget", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setSuccessMessage(data.detail);
            handleModal();
            cleanForm();
            window.location.reload();
        }

    };

    const handleUpdateBudget = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                value: budget * 100,
                category_id: category_id,
                id: id
            })
        };

        const response = await fetch(`/api/budget/${id}`, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setSuccessMessage(data.detail);
            handleModal();
            cleanForm();
            window.location.reload();
        }

    };


    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}>
                <div className="modal-card" onClick={(e) => { e.stopPropagation(); }}>
                    <header className="modal-card-head has-background-primary-light">
                        <h1 className="modal-card-title">
                            {id ? "Change Budget" : "Set Budget"}
                        </h1>
                    </header>
                    <section className="modal-card-body">
                        <form>
                            <div className="field">
                                <label className="label">Budget value</label>
                                <div className="control">
                                    <input
                                        type="number"
                                        placeholder="100.00"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="input"
                                        required
                                        min={0}
                                        step={0.01}
                                    />
                                </div>
                            </div>
                            {id ? (
                                <div className="field">
                                    <label className="label">Current spend in category</label>
                                    <div className="control">
                                        { (spendings / 100) + " PLN" }
                                    </div>
                                </div>
                            ) : null}
                        </form>
                    </section>
                    <footer className="modal-card-foot has-background-primary-light">
                        {id ? (
                            <button className="button is-info" onClick={handleUpdateBudget}>
                                Update
                            </button>
                        ) : (
                            <button className="button is-primary" onClick={handleCreateBudget}>
                                &nbsp;Set&nbsp;
                            </button>
                        )}
                        <button className="button" onClick={handleModal}>
                            Cancel
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    )
};

export default BudgetsModal;
