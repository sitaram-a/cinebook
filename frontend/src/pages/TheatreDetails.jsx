import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function TheatreDetails() {

    const { theatreId } = useParams();
    const navigate = useNavigate();

    const [theatre, setTheatre] = useState(null);
    const [shows, setShows] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD THEATRE + SHOWS
    // =========================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const theatreResponse =
                    await api.get(
                        `/theatres/${theatreId}`
                    );

                setTheatre(theatreResponse.data);


                /*
                 * Load shows for this theatre.
                 *
                 * We already have:
                 *
                 * GET /shows/screen/{screenId}
                 *
                 * Therefore we first get the screens
                 * belonging to this theatre and then load
                 * the shows for those screens.
                 */

                const screensResponse =
                    await api.get(
                        `/screens/theatre/${theatreId}`
                    );

                const screens =
                    screensResponse.data || [];


                // Load shows for every screen

                const showResponses =
                    await Promise.all(
                        screens.map((screen) =>
                            api.get(
                                `/shows/screen/${screen.id}`
                            )
                        )
                    );


                const allShows =
                    showResponses.flatMap(
                        response => response.data || []
                    );


                // Only active shows

                const activeShows =
                    allShows.filter(
                        show => show.active
                    );


                // Sort by start time

                activeShows.sort(
                    (a, b) =>
                        new Date(a.startTime) -
                        new Date(b.startTime)
                );


                setShows(activeShows);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load theatre."
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [theatreId]);


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            [],
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <main className="page">

                    <div className="page-message">
                        Loading theatre...
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

                        <button
                            className="hero-button"
                            onClick={() =>
                                navigate("/theatres")
                            }
                        >
                            ← Back to Theatres
                        </button>

                    </div>

                </main>
            </>
        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (
        <>
            <Navbar />

            <main className="page">

                <div className="container">

                    {/* BACK */}

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/theatres")
                        }
                    >
                        ← Back to Theatres
                    </button>


                    {/* THEATRE HEADER */}

                    <div className="page-header">

                        <p className="section-label">
                            THEATRE
                        </p>

                        <h1>
                            {theatre?.name}
                        </h1>

                        <p>
                            📍 {theatre?.address}
                        </p>

                        <p>
                            {theatre?.city}
                            {" · "}
                            🎞️ {theatre?.totalScreens ?? 0}
                            {" Screens"}
                        </p>

                    </div>


                    {/* SHOWS */}

                    <div className="section-header">

                        <div>

                            <p className="section-label">
                                NOW SHOWING
                            </p>

                            <h2>
                                Available Shows
                            </h2>

                        </div>

                        <span>
                            {shows.length} Shows
                        </span>

                    </div>


                    {shows.length === 0 ? (

                        <div className="page-message">

                            <h2>
                                No shows available
                            </h2>

                            <p>
                                There are currently no active
                                shows at this theatre.
                            </p>

                        </div>

                    ) : (

                        <div className="show-list">

                            {shows.map((show) => (

                                <div
                                    className="show-card"
                                    key={show.id}
                                >

                                    {/* MOVIE */}

                                    <div className="show-card-main">

                                        <p className="section-label">
                                            MOVIE
                                        </p>

                                        <h2>
                                            {show.movie?.title ||
                                                "Unknown Movie"}
                                        </h2>

                                        <p>
                                            {formatDate(
                                                show.startTime
                                            )}
                                        </p>

                                    </div>


                                    {/* TIME */}

                                    <div className="show-time">

                                        <span>
                                            Showtime
                                        </span>

                                        <strong>
                                            {formatTime(
                                                show.startTime
                                            )}
                                        </strong>

                                    </div>


                                    {/* PRICE */}

                                    <div className="show-price">

                                        <span>
                                            Price
                                        </span>

                                        <strong>
                                            ₹{show.price}
                                        </strong>

                                    </div>


                                    {/* BOOK */}

                                    <button
                                        className="hero-button"
                                        onClick={() =>
                                            navigate(
                                                `/shows/${show.id}/seats`
                                            )
                                        }
                                    >
                                        Select Seats →
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}

export default TheatreDetails;