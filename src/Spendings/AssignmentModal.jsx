import React, { useState, useEffect } from "react";
import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

const SpendingsModal = ({
    active,
    handleModal,
    token,
    selectedRecords,
    setErrorMessage,
    setSuccessMessage
}) => {
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState(null);
    const [successModalMessage, setModalSuccessMessage] = useState("");
    const [errorModalMessage, setErrorModalMessage] = useState("");

    useEffect(() => {
        const getCategories = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            };

            const response = await fetch(`/api/categories-dashboard?skip=0&limit=200`, requestOptions);

            if (!response.ok) {
                setErrorModalMessage("Somthing went wrong");
            }
            else {
                const data = await response.json();
                setCategories(data.categories);
            }
        };
        getCategories();
    }, [token]);

    const cleanForm = () => {
        setCategoryId("");
    }

    const handleCategoryAssignment = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                category_id: categoryId,
                financial_record_ids: selectedRecords
            })
        };

        const response = await fetch(`/api/financial-record/mass-category-assigment`, requestOptions);

        if (!response.ok) {
            setErrorModalMessage("Somthing went wrong");
        }
        else {
            const data = await response.json();
            setSuccessMessage(data.message);
            setTimeout(() => {
                handleModal();
            }, 1000);
            cleanForm();
        }
    };

    return (
        <div className={`modal ${active ? "is-active" : ""}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card" onClick={(e) => { e.stopPropagation(); }}>
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title has-text-centered">
                        Assign Category
                    </h1>
                </header>
                <section className="modal-card-body">
                    {successModalMessage || errorModalMessage ? (
                        <div className="box">
                            <ErrorMessage errorMessage={successModalMessage} />
                            <SuccessMessage successMessage={errorModalMessage} />
                        </div>
                    ) : (null)}
                    <form>
                        <div className="field">
                            <label className="label">Category</label>
                            <div className="control">
                                <div className="select">
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories && categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-success" onClick={handleCategoryAssignment}>Save</button>
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default SpendingsModal;
