import React, { useState, useContext, useEffect } from "react";
import moment from "moment";

import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

import { UserContext } from "../context/UserContext";

import CategoriesModal from "./CategoriesModal";

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

    const getCategories = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        const response = await fetch(`/api/categories?skip=${skip}&limit=${limit}`, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setCategories(data);
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
        const data = await response.json();

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
            <button className="button is-fullwidth mb-5 is-primary" onClick={ () => setActiveModal(true) }>
                Create Category
            </button>
            <ErrorMessage message={errorMessage} />
            <SuccessMessage message={successMessage} />
            {loaded && categories ? (
                <table className="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Spendings</th>
                            <th>Budget</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                {/* TODO: Improve backend endpoint to return spendings and budget */}
                                <td>{category.spendings}</td>
                                <td>{category.budget}</td>
                                <td>
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
            ) : (
                <p>Loading</p>
            )}
        </>
    );
};

export default Categories;
