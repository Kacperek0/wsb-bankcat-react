import React, { useState, useEffect } from "react";

const CategoriesModal = ({
    active,
    handleModal,
    token,
    id,
    setErrorMessage,
    setSuccessMessage
}) => {
    const [name, setName] = useState("");

    useEffect(() => {
        const getCategories = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({name: name}),
            };


            // TODO: Backend endpoint for getting a single category
            const response = await fetch(`/api/categories/${id}`, requestOptions);

            if (!response.ok) {
                setErrorMessage("Somthing went wrong");
            }
            else {
                const data = await response.json();
                setName(data.name);
            }
        };
        if (id) {
            getCategories();
        }
        }, [id, token]);


    const cleanForm = () => {
        setName("");
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: name
            })
        };

        const response = await fetch("/api/categories", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setSuccessMessage(data.detail);
            handleModal();
            cleanForm();
        }

    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: name
            })
        };

        const response = await fetch(`/api/categories/${id}`, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setSuccessMessage(data.detail);
            handleModal();
            cleanForm();
        }

    };


    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}>
                <div className="modal-card" onClick={(e) => { e.stopPropagation(); }}>
                    <header className="modal-card-head has-background-primary-light">
                        <h1 className="modal-card-title">
                            { id ? "Edit Category" : "Add Category" }
                        </h1>
                    </header>
                    <section className="modal-card-body">
                        <form>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input
                                        type="text"
                                        placeholder="Category Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </section>
                    <footer className="modal-card-foot has-background-primary-light">
                        {id ? (
                            <button className="button is-info" onClick={handleUpdateCategory}>
                                Update
                            </button>
                        ) : (
                            <button className="button is-primary" onClick={handleCreateCategory}>
                                Create
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

export default CategoriesModal;
