import React, { useState, useContext, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

import { UserContext } from "../context/UserContext";

import CategoriesModal from "./CategoriesModal";
import InsightsModal from "../Insights/InsightsModal";

const Categories = () => {
    const [token] = useContext(UserContext);
    const [categories, setCategories] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState("");
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(100);
    const [activeInsightsModal, setActiveInsightsModal] = useState(false);
    const [insightsCategoryId, setInsightsCategoryId] = useState("");
    const [spendings, setSpendings] = useState(0);

    const getCategories = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        const response = await fetch(`/api/categories-dashboard?skip=${skip}&limit=${limit}`, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setCategories(data.categories);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getCategories();
        setId(null)
    }

    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        const response = await fetch(`/api/categories/${id}`, requestOptions);

        if (!response.ok) {
            setErrorMessage("Only empty categories can be deleted");
        }
        else {
            setSuccessMessage("Category deleted");
            setTimeout(() => {
                getCategories();
            }, 1000);
            setSuccessMessage("");
        }
    };

    const handleUpdate = (id) => {
        setId(id);
        setActiveModal(true);
    };

    const handleInsightsModal = () => {
        setActiveInsightsModal(!activeInsightsModal);
        setInsightsCategoryId(null);
        setSpendings(0);
    }

    const handleInsights = (insightsCategoryId, spendings) => {
        setInsightsCategoryId(insightsCategoryId);
        setSpendings(spendings);
        setActiveInsightsModal(true);
    };

    const processData = () => {
        const data = [];
        const other = {
            title: "Other",
            value: 0,
            // Assign light blue color for "Other" category
            color: "#21266a"
        };

        categories.sort((a, b) => b.spendings - a.spendings);

        categories.forEach((category, index) => {
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
            <CategoriesModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                id={id}
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
            <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
                Create Category
            </button>
                {errorMessage || successMessage ? (
                    <div className="box is-fullwidth">
                    <ErrorMessage errorMessage={errorMessage} />
                    <SuccessMessage successMessage={successMessage} />
                    </div>
                ) : null}
            {loaded && categories ? (
                <>
                    <div className="box is-fullwidth">
                        <PieChart
                            data={processData()}
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
                            center={[50, 55]}

                        />
                    </div>
                    <table className="table is-fullwidth is-striped">
                        <thead>
                            <tr>
                                <th className="has-text-centered">Name</th>
                                <th className="has-text-centered">Spendings</th>
                                <th className="has-text-centered">Budget</th>
                                <th className="has-text-centered">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="has-text-centered">
                                        <a onClick={() => handleInsights(category.id, category.spendings)}>
                                            {category.name}
                                        </a>
                                    </td>
                                    <td className="has-text-centered">{(category.spendings / 100).toFixed(2) + " PLN"}</td>
                                    <td className="has-text-centered">{category.budget === 0 ? (
                                        <a href="/budgets">
                                            <span className="has-text-danger">No budget</span>
                                        </a>
                                    ) : (
                                        (category.budget / 100).toFixed(2) + " PLN"
                                        )}
                                    </td>
                                    <td className="has-text-centered">
                                        <button className="button mr-2 is-info is-light" onClick={() => handleUpdate(category.id)}>
                                            Update
                                        </button>
                                        <button className="button mr-2 is-danger is-light" onClick={() => handleDelete(category.id)}>
                                            Delete
                                        </button>
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

export default Categories;
