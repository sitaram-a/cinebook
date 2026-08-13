import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [movieCount, setMovieCount] = useState(0);
    const [theatreCount, setTheatreCount] = useState(0);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const dashboardResponse = await api.get(
                    "/admin/dashboard"
                );

                setMessage(
                    dashboardResponse.data.message
                );

                const [moviesResponse, theatresResponse] =
                    await Promise.all([
                        api.get("/movies"),
                        api.get("/theatres")
                    ]);

                setMovieCount(
                    moviesResponse.data.length
                );

                setTheatreCount(
                    theatresResponse.data.length
                );

            } catch (error) {

                console.error(error);

                if (error.response?.status === 403) {

                    setError(
                        "You do not have permission to access the admin dashboard."
                    );

                } else {

                    setError(
                        "Unable to load admin dashboard."
                    );
                }

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);


    if (loading) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    Loading admin dashboard...
                </div>
            </>
        );
    }


    if (error) {

        return (
            <>
                <Navbar />

                <div className="page-message">

                    <h2>
                        Access Denied
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="hero-button"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>

                </div>
            </>
        );
    }


    return (
        <>
            <Navbar />

            <main className="admin-page">

                <div className="admin-container">

                    <div className="admin-header">

                        <p className="section-label">
                            ADMINISTRATION
                        </p>

                        <h1>
                            CineBook Admin Dashboard
                        </h1>

                        <p>
                            {message}
                        </p>

                    </div>


                    <div className="admin-grid">

                        {/* MOVIES */}

                        <div className="admin-card">

                            <div className="admin-card-icon">
                                🎬
                            </div>

                            <h2>
                                Movies
                            </h2>

                            <div className="admin-card-count">
                                {movieCount}
                            </div>

                            <p>
                                Manage movies and movie information.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/admin/movies")
                                }
                            >
                                Manage Movies
                            </button>

                        </div>


                        {/* THEATRES */}

                        <div className="admin-card">

                            <div className="admin-card-icon">
                                🏢
                            </div>

                            <h2>
                                Theatres
                            </h2>

                            <div className="admin-card-count">
                                {theatreCount}
                            </div>

                            <p>
                                Manage theatres and locations.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/admin/theatres")
                                }
                            >
                                Manage Theatres
                            </button>

                        </div>


                        {/* SCREENS */}

                        <div className="admin-card">

                            <div className="admin-card-icon">
                                🖥️
                            </div>

                            <h2>
                                Screens
                            </h2>

                            <p>
                                Manage theatre screens.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/admin/screens")
                                }
                            >
                                Manage Screens
                            </button>

                        </div>


                        {/* SEATS */}

                        <div className="admin-card">

                            <div className="admin-card-icon">
                                💺
                            </div>

                            <h2>
                                Seats
                            </h2>

                            <p>
                                Manage screen seating.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/admin/seats")
                                }
                            >
                                Manage Seats
                            </button>

                        </div>


                        {/* SHOWS */}

                        <div className="admin-card">

                            <div className="admin-card-icon">
                                🎭
                            </div>

                            <h2>
                                Shows
                            </h2>

                            <p>
                                Create and manage movie shows.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/admin/shows")
                                }
                            >
                                Manage Shows
                            </button>

                        </div>


                        {/* BOOKINGS */}

                        <div className="admin-card">

                            <div className="admin-card-icon">
                                📋
                            </div>

                            <h2>
                                Bookings
                            </h2>

                            <p>
                                View and manage customer bookings.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/admin/bookings")
                                }
                            >
                                View Bookings
                            </button>

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
}

export default AdminDashboard;