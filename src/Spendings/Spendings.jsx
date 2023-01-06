import React, { useState, useContext, useEffect } from "react";

import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

import { UserContext } from "../context/UserContext";

import SpendingsModal from "./SpendingsModal";
import AssignmentModal from "./AssignmentModal";

const Spendings = () => {
    const [token] = useContext(UserContext);
    const [spendings, setSpendings] = useState(null);
    const [categories, setCategories] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(20);
    const [query, setQuery] = useState("");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [activeModal, setActiveModal] = useState(false);
    const [activeAssignModal, setActiveAssignModal] = useState(false);

    const getSpendings = async (skip, limit, query) => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        let url = "";

        if (query === "") {
            url = `/api/financial-record?skip=${skip}&limit=${limit}`;
        }
        else {
            url = `/api/financial-record?skip=${skip}&limit=${limit}&query=${query}`;
        }
        const response = await fetch(url, requestOptions);

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setSpendings(data);
            setLoaded(true);
        }
    };

    const getCategories = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        const response = await fetch(`/api/categories-dashboard?skip=0&limit=200`, requestOptions);
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
        setTimeout(() => {
            getSpendings(skip, limit, query);
        }, 500);
    }, []);

    const handleNext = () => {
        setSkip(skip + limit);
        getSpendings(skip + limit, limit, query);
    };

    const handlePrevious = () => {
        if (skip <= 0) {
            setSkip(0);
        }
        else {
            setSkip(skip - limit);
        }
        getSpendings(skip - limit, limit, query);
    };

    const handleLimit = (limitInput) => {
        setLimit(limitInput);
        getSpendings(0, limitInput, query);
    };

    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        const response = await fetch(`/api/financial-record/${id}`, requestOptions);

        if (!response.ok) {
            setErrorMessage("Only empty categories can be deleted");
        }
        else {
            setSuccessMessage("Category deleted");
            setTimeout(() => {
                getSpendings(skip, limit, query);
            }, 1000);
            setSuccessMessage("");
        }
    };

    const handleSelect = (id) => {
        if (id === "all") {
            if (selectedRecords.length === spendings.length) {
                setSelectedRecords([]);
            } else {
                setSelectedRecords(spendings.map((spending) => spending.id));
            }
        } else {
            if (selectedRecords.includes(id)) {
                setSelectedRecords(selectedRecords.filter((recordId) => recordId !== id));
            } else {
                setSelectedRecords([...selectedRecords, id]);
            }
        }
    };

    const getCategoryName = (categoryId) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === categoryId) {
                return categories[i].name;
            }
        }
        return "";
    }

    const handleModal = () => {
        setActiveModal(!activeModal);
        getSpendings(skip, limit, query);
    };

    const handleAssignModal = () => {
        setActiveAssignModal(!activeAssignModal);
        getSpendings(skip, limit, query);
    };

    // const handleUpdate = (id) => {
    //     setId(id);
    //     setActiveModal(true);
    // };

    return (
        <>
            {errorMessage || successMessage ? (
                <div className="box is-fullwidth">
                    <ErrorMessage errorMessage={errorMessage} />
                    <SuccessMessage successMessage={successMessage} />
                </div>
            ) : null}
            <br />
            <SpendingsModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
            />
            <AssignmentModal
                active={activeAssignModal}
                handleModal={handleAssignModal}
                token={token}
                selectedRecords={selectedRecords}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
            />
            {loaded && spendings ? (
                <>
                    <div className="columns">
                        <div className="column is-half">
                            <div className="field has-addons">
                                <div className="control is-expanded">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Search"
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </div>
                                <div className="control">
                                    <button
                                        className="button is-info"
                                        onClick={() => getSpendings(skip, limit, query)}
                                    >
                                        Search
                                    </button>
                                    <button
                                        className="button is-info"
                                        onClick={() => getSpendings(skip, limit, "")}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="field has-addons is-pulled-right">
                                <div className="control">
                                    <button
                                        className="button is-primary is-light"
                                        onClick={() => handleAssignModal()}
                                    >
                                        Assign Category
                                    </button>
                                    <button
                                        className="button is-primary"
                                        onClick={() => handleModal()}
                                    >
                                        Add Cash Spending
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table is-fullwidth is-striped">
                        <thead>
                            <tr>
                                <th>
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedRecords.length === spendings.length}
                                            onChange={(event) => {
                                                handleSelect("all");
                                            }}
                                        />
                                    </label>
                                </th>
                                <th className="has-text-centered">Date</th>
                                <th className="has-text-centered">Description</th>
                                <th className="has-text-centered">Category</th>
                                <th className="has-text-centered">Amount</th>
                                <th className="has-text-centered">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spendings.map((spending) => (
                                <tr key={spending.id}>
                                    <td className="is-centered is-middle">
                                        <input type="checkbox" checked={selectedRecords.includes(spending.id)} onChange={() => handleSelect(spending.id)} />
                                    </td>
                                    <td className="has-text-centered">{spending.date}</td>
                                    <td className="has-text-centered">{spending.description}</td>
                                    <td className="has-text-centered">{getCategoryName(spending.category_id)}</td>
                                    <td className="has-text-centered">{(spending.amount / 100).toFixed(2) + " PLN"}</td>
                                    <td className="has-text-centered">
                                        <button className="button mr-2 is-danger is-light" onClick={() => handleDelete(spending.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="columns">
                        <div className="column is-half">
                            <div className="field has-addons">
                                <div className="control">
                                    <button
                                        className="button is-secondary"
                                        onClick={() => handlePrevious()}
                                    >
                                        Previous
                                    </button>
                                </div>
                                <div className="control">
                                    <button
                                        className="button is-info"
                                        onClick={() => handleNext()}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="field has-addons is-pulled-right">
                                <div className="control">
                                    {limit === 20 ? (
                                        <button
                                            className="button is-info"
                                            onClick={() => handleLimit(20)}
                                        >
                                            20
                                        </button>
                                    ) : (
                                            <button
                                                className="button is-secondary"
                                                onClick={() => handleLimit(20)}
                                            >
                                                20
                                            </button>
                                    )}
                                </div>
                                <div className="control">
                                    {limit === 50 ? (
                                        <button
                                            className="button is-info"
                                            onClick={() => handleLimit(50)}
                                        >
                                            50
                                        </button>
                                    ) : (
                                        <button
                                            className="button is-secondary"
                                            onClick={() => handleLimit(50)}
                                        >
                                            50
                                        </button>
                                    )}
                                </div>
                                <div className="control">
                                    {limit === 100 ? (
                                        <button
                                            className="button is-info"
                                            onClick={() => handleLimit(100)}
                                        >
                                            100
                                        </button>
                                    ) : (
                                        <button
                                            className="button is-secondary"
                                            onClick={() => handleLimit(100)}
                                        >
                                            100
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                </>
            ) : (<p>Please log in to see your spendings</p>) }
        </>
    );
};

export default Spendings;
