import React, { useState, useContext, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import BarChart from "react-easy-bar-chart"

import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

import { UserContext } from "../context/UserContext";

import BudgetsModal from "./BudgetsModal";
import InsightsModal from "../Insights/InsightsModal";

const Budgets = () => {
    const [token] = useContext(UserContext);
    const [budgets, setBudgets] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [activeInsightsModal, setActiveInsightsModal] = useState(false);
    const [insightsCategoryId, setInsightsCategoryId] = useState("");
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

    const handleInsightsModal = () => {
        setActiveInsightsModal(!activeInsightsModal);
        setInsightsCategoryId(null);
        setSpendings(0);
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

    const handleInsights = (insightsCategoryId, spendings) => {
        setInsightsCategoryId(insightsCategoryId);
        setSpendings(spendings);
        setActiveInsightsModal(true);
    };

    const pieChartData = () => {
        const data = [];
        const other = {
            title: "Non-budgeted",
            value: 0,
            color: "#D21F3C"
        };

        const budgeted = {
            title: "Budgeted",
            value: 0,
            color: "#043927"
        };

        budgets.forEach((budget) => {
            if (budget.budget !== 0) {
                budgeted.value += budget.category.spendings;
            } else {
                other.value += budget.category.spendings;
            }
        });

        data.push(other);
        data.push(budgeted);

        return data;
    };

    const barChartData = () => {
        const data = [];

        // Copy budgets array
        const budgetsHelper = [...budgets];

        // Sort budgetsHelper by spendings in categories with budget
        const sortedBudgetsByBudget = budgetsHelper.sort((a, b) => {
            return b.budget - a.budget;
        });

        // Sort data with budget by spendings
        const sortBudgetBySpendings = sortedBudgetsByBudget.sort((a, b) => {
            if (a.budget === 0) {
                return 1;
            }
            return b.category.spendings - a.category.spendings;
        });

        sortBudgetBySpendings.forEach((budget, index) => {
            if (index < 5 && budget.budget !== 0) {
                data.push({
                    title: budget.category.name,
                    value: (budget.category.spendings / 100).toFixed(2),
                    color: "#D21F3C"
                });

                data.push({
                    title: budget.category.name + " budget",
                    value: (budget.budget / 100).toFixed(2),
                    color: "#043927"
                });
            }
        });

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
            <InsightsModal
                active={activeInsightsModal}
                handleModal={handleInsightsModal}
                token={token}
                insightsCategoryId={insightsCategoryId}
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
                    <div className="columns">
                        <div className="column has-text-centered">
                            <p className="has-text-centered"><strong>Top 5 budgeted categories</strong></p>
                            <BarChart
                                data={barChartData()}
                                xAxis={ "Categories" }
                                yAxis={ "Spendings" }
                                height={400}
                                width={400}
                            />
                        </div>
                        <div className="column has-text-centered">
                            <p className="has-text-centered"><strong>Budgeted vs non-bugeted expenses</strong></p>
                            <PieChart
                                data={pieChartData()}
                                label={({ dataEntry }) => dataEntry.title}
                                labelStyle={{
                                    fontSize: "5px",
                                    fontFamily: "sans-serif"
                                }}
                                labelPosition={108}
                                radius={50}
                                lineWidth={50}
                                animate
                                animationEasing="ease-out"
                                viewBoxSize={[115, 115]}
                                // adjust svg size
                                style={{ height: "400px" }}
                                center={[60, 55]}
                            />
                        </div>
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
                                    <td className="has-text-centered">
                                        <a onClick={() => handleInsights(budget.category.id, budget.category.spendings)}>
                                            {budget.category.name}
                                        </a>
                                    </td>
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
