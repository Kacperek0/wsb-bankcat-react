import React, { useState, useEffect } from "react";
import ErrorMessage from "../components/Messages/ErrorMessage";
import SuccessMessage from "../components/Messages/SuccessMessage";

const InsightsModal = ({
    active,
    handleModal,
    token,
    insightsCategoryId,
    spendings,
    setErrorMessage,
    setSuccessMessage
}) => {
    const [financialRecords, setFinancialRecords] = useState([]);

    useEffect(() => {
        const getInsights = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            };
            const response = await fetch(`/api/financial-record-by-category?skip=0&limit=20&category_id=${insightsCategoryId}`, requestOptions);

            console.log(response)
            if (!response.ok) {
                setErrorMessage("Somthing went wrong");
            }
            else {
                const data = await response.json();
                setFinancialRecords(data);
            }
        };
        if (insightsCategoryId) {
            getInsights();
        }
    }, [insightsCategoryId, token]);

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}>
                <div className="modal-card" onClick={(e) => { e.stopPropagation(); }}>
                    <header className="modal-card-head has-background-primary-light">
                        <h1 className="modal-card-title has-text-centered">
                            Category insights
                        </h1>
                    </header>
                    <section className="modal-card-body">
                        <div className="box has-text-centered">
                            <h2 className="title is-4">Total spendings</h2>
                            <h2 className="title is-1">{(spendings / 100).toFixed(2) + " PLN"}</h2>
                        </div>
                        <table className="table is-fullwidth is-striped">
                            <thead>
                                <tr>
                                    <th className="has-text-centered">Date</th>
                                    <th className="has-text-centered">Amount</th>
                                    <th className="has-text-centered">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {financialRecords.map((financialRecord) => (
                                    <tr key={financialRecord.id}>
                                        <td className="has-text-centered">{financialRecord.date}</td>
                                        <td className="has-text-centered">{(financialRecord.amount / 100).toFixed(2) + " PLN"}</td>
                                        <td className="has-text-centered">{financialRecord.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    <footer className="modal-card-foot has-background-primary-light">
                        <button className="button" onClick={handleModal}>
                            Cancel
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    )
};

export default InsightsModal;
