import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Theatres() {

    const navigate = useNavigate();

    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD THEATRES
    // =========================================================

    useEffect(() => {

        const loadTheatres = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/theatres");

                setTheatres(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load theatres."
                );

            } finally {

                setLoading(false);

            }
        };

        loadTheatres();

    }, []);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <main className="page">

                    <div className="page-message">
                        Loading theatres...
                    </div>

                </main>
            </>
        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <>
                <Navbar />

                <main className="page">

                    <div className="page-message">

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                    </div>

                </main>
            </>
        );

    }


    return (
        <>
            <Navbar />

            <main className="page">

                <div className="container">

                    {/* HEADER */}

                    <div className="page-header">

                        <p className="section-label">
                            CINEBOOK
                        </p>

                        <h1>
                            Theatres
                        </h1>

                        <p>
                            Find a theatre and explore available
                            movie shows.
                        </p>

                    </div>


                    {/* NO THEATRES */}

                    {theatres.length === 0 ? (

                        <div className="page-message">

                            <h2>
                                No theatres available
                            </h2>

                            <p>
                                There are currently no theatres
                                available.
                            </p>

                        </div>

                    ) : (


                        /* THEATRE LIST */

                        <div className="theatre-grid">

                            {theatres.map((theatre) => (

                                <div
                                    className="theatre-card"
                                    key={theatre.id}
                                >

                                    {/* ICON */}

                                    <div className="theatre-icon">
                                        🎬
                                    </div>


                                    {/* DETAILS */}

                                    <div className="theatre-card-content">

                                        <p className="section-label">
                                            THEATRE
                                        </p>

                                        <h2>
                                            {theatre.name}
                                        </h2>


                                        {/* LOCATION */}

                                        {theatre.location && (

                                            <p className="theatre-location">
                                                📍 {theatre.location}
                                            </p>

                                        )}


                                        {/* ADDRESS */}

                                        {theatre.address && (

                                            <p className="theatre-address">
                                                {theatre.address}
                                            </p>

                                        )}


                                        {/* SCREEN COUNT */}

                                        <div className="theatre-meta">

                                            <span>
                                                🎞️
                                            </span>

                                            <strong>
                                                {theatre.totalScreens ?? 0}
                                            </strong>

                                            <span>
                                                Screens
                                            </span>

                                        </div>


                                        {/* ACTION */}

                                        <button
                                            className="hero-button"
                                            onClick={() =>
                                                navigate(
                                                    `/theatres/${theatre.id}`
                                                )
                                            }
                                        >
                                            View Shows →
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}

export default Theatres;