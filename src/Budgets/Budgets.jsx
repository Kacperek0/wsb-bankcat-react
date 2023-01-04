import React, { useState, useContext, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

import { UserContext } from "../context/UserContext";

import BudgetsModal from "./BudgetsModal";

const Budgets = () => {
    const [token] = useContext(UserContext);
    const [budgets, setBudgets] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [spendings, setSpendings] = useState(0);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(100);

    const getBudgets = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        const response = await fetch(`/api/budget-dashboard?skip=${skip}&limit=${limit}`, requestOptions);
        const data = await response.json();
        console.log(data)

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setBudgets(data.budget);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getBudgets();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getBudgets();
        setId(null)
        setCategoryId(null)
        setSpendings(0)
    }

    const handleDelete = async (id) => {
        if (id) {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            };

            const response = await fetch(`/api/budget/${id}`, requestOptions);

            if (!response.ok) {
                setErrorMessage("Oops something went wrong");
            }
            else {
                setSuccessMessage("Budget deleted");
                setTimeout(() => {
                    getBudgets();
                }, 1000);
                setSuccessMessage("");
                window.location.reload();
            }
        }
        else {
            setErrorMessage("Budget does not exist");
        }
    };

    const handleUpdate = (id, categoryId, spendings) => {
        setId(id);
        setCategoryId(categoryId);
        setSpendings(spendings);
        setActiveModal(true);
    };

    const handleSet = (id, categoryId) => {
        setId(id);
        setCategoryId(categoryId);
        setActiveModal(true);
    };

    // Process data for pie chart, returns array of objects for top 5 categories with biggest spendings and one object for all other categories
    const processData = () => {
        const data = [];
        const other = {
            title: "Other",
            value: 0,
            // Assign light blue color for "Other" category
            color: "#21266a"
        };

        budgets.sort((a, b) => b.spendings - a.spendings);

        budgets.forEach((category, index) => {
            if (index < 5) {
                data.push({
                    title: category.name,
                    value: category.spendings,
                    color: ''
                });
            }
            else {
                other.value += category.spendings;
            }
        });

        data.push(other);

        // Assign color for 5 categories
        data[0].color = "#50964a";
        data[1].color = "#d6493a";
        data[2].color = "#3ad6bc";
        data[3].color = "#2732d6";
        data[4].color = "#6A2135";

        return data;
    };

    return (
        <>
            <BudgetsModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                id={id}
                category_id={categoryId}
                spendings={spendings}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
            />
            {errorMessage || successMessage ? (
                <div className="box is-fullwidth">
                    <ErrorMessage errorMessage={errorMessage} />
                    <SuccessMessage successMessage={successMessage} />
                </div>
            ) : null}
            <br />
            {loaded && budgets ? (
                <>
                    <div className="box is-half-width">
                        <PieChart
                            data={processData()}
                            label={({ dataEntry }) => dataEntry.title}
                            labelStyle={{
                                fontSize: "5px",
                                fontFamily: "sans-serif"
                            }}
                            labelPosition={108}
                            radius={50}
                            lineWidth={20}
                            animate
                            animationEasing="ease-out"
                            viewBoxSize={[115, 115]}
                            // adjust svg size
                            style={{ height: "400px" }}
                            center={[50, 55]}
                        />
                    </div>
                    <table className="table is-fullwidth is-striped">
                        <thead>
                            <tr>
                                <th className="has-text-centered">Category</th>
                                <th className="has-text-centered">Spendings</th>
                                <th className="has-text-centered">Budget</th>
                                <th className="has-text-centered">Result</th>
                                <th className="has-text-centered">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map((budget) => (
                                <tr key={budget.id}>
                                    <td className="has-text-centered">{budget.category.name}</td>
                                    <td className="has-text-centered">{(budget.category.spendings / 100).toFixed(2) + " PLN"}</td>
                                    <td className="has-text-centered">{budget.budget === 0 ? (
                                        <span className="has-text-danger">No budget</span>
                                    ) : (
                                        (budget.budget / 100).toFixed(2) + " PLN"
                                    )}
                                    </td>
                                    <td className="has-text-centered">
                                        {budget.category.spendings > budget.budget && budget.budget !== 0 ? (
                                            <span className="has-text-danger">
                                                Budget exceeded!
                                            </span>
                                        ) : (
                                                <>
                                                    {budget.budget === 0 ? (
                                                        <span>
                                                            No budget set!
                                                        </span>
                                                    ): (
                                                        <span className="has-text-success">
                                                            You are in control of your spendings!
                                                            </span>
                                                    )}
                                            </>
                                        )}
                                    </td>
                                    <td className="has-text-centered">
                                        {budget.id ? null : (
                                        <button className="button mr-2 is-primary is-light" onClick={() => handleSet(budget.id, budget.category.id)}>
                                            &nbsp;&nbsp;Set&nbsp;&nbsp;
                                        </button>
                                        )}
                                        {budget.id ? (
                                            <>
                                                <button className="button mr-2 is-info is-light" onClick={() => handleUpdate(budget.id, budget.category.id, budget.category.spendings)}>
                                                    Update
                                                </button>
                                                <button className="button mr-2 is-danger is-light" onClick={() => handleDelete(budget.id)}>
                                                    Delete
                                                </button>
                                            </>
                                        ) : null}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>Please login first to access this section.</p>
            )}
        </>
    );
};

export default Budgets;
