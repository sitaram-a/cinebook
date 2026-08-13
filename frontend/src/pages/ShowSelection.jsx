import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function ShowSelection() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [shows, setShows] = useState([]);
    const [movie, setMovie] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD SHOWS
    // =========================================================

    useEffect(() => {

        const loadShows = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/shows");

                const movieShows = response.data.filter(
                    (show) =>
                        show.movie &&
                        show.movie.id === Number(id) &&
                        show.active === true
                );

                setShows(movieShows);

                if (movieShows.length > 0) {
                    setMovie(movieShows[0].movie);
                }

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load shows."
                );

            } finally {

                setLoading(false);

            }
        };

        loadShows();

    }, [id]);


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        const date = new Date(dateTime);

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        const date = new Date(dateTime);

        return date.toLocaleDateString([], {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };


    // =========================================================
    // GET DATE KEY
    // =========================================================

    const getDateKey = (dateTime) => {

        if (!dateTime) {
            return "";
        }

        const date = new Date(dateTime);

        return date.toLocaleDateString("en-CA");
    };


    // =========================================================
    // GROUP SHOWS
    //
    // Theatre
    //    ↓
    // Screen
    //    ↓
    // Date
    //    ↓
    // Showtimes
    // =========================================================

    const groupedTheatres = useMemo(() => {

        const theatreMap = {};

        shows.forEach((show) => {

            const theatre =
                show.screen?.theatre;

            const screen =
                show.screen;

            if (!theatre || !screen) {
                return;
            }


            // -------------------------------------------------
            // THEATRE
            // -------------------------------------------------

            if (!theatreMap[theatre.id]) {

                theatreMap[theatre.id] = {
                    id: theatre.id,
                    name: theatre.name,
                    address: theatre.address,
                    screens: {}
                };

            }


            // -------------------------------------------------
            // SCREEN
            // -------------------------------------------------

            if (
                !theatreMap[theatre.id]
                    .screens[screen.id]
            ) {

                theatreMap[theatre.id]
                    .screens[screen.id] = {
                        id: screen.id,
                        name: screen.name,
                        dates: {}
                    };

            }


            // -------------------------------------------------
            // DATE
            // -------------------------------------------------

            const dateKey =
                getDateKey(show.startTime);

            const screenData =
                theatreMap[theatre.id]
                    .screens[screen.id];

            if (!screenData.dates[dateKey]) {

                screenData.dates[dateKey] = {
                    date: show.startTime,
                    shows: []
                };

            }


            // -------------------------------------------------
            // SHOW
            // -------------------------------------------------

            screenData.dates[dateKey]
                .shows
                .push(show);

        });


        // Convert objects into arrays
        return Object.values(theatreMap).map(
            (theatre) => ({

                ...theatre,

                screens: Object.values(
                    theatre.screens
                ).map((screen) => ({

                    ...screen,

                    dates: Object.values(
                        screen.dates
                    ).map((date) => ({

                        ...date,

                        shows: date.shows.sort(
                            (a, b) =>
                                new Date(a.startTime) -
                                new Date(b.startTime)
                        )

                    })).sort(
                        (a, b) =>
                            new Date(a.date) -
                            new Date(b.date)
                    )

                })

            )})
        );

    }, [shows]);


    // =========================================================
    // SELECT SHOW
    // =========================================================

    const handleShowSelect = (showId) => {

        navigate(
            `/shows/${showId}/seats`
        );

    };


    // =========================================================
    // BACK TO MOVIE
    // =========================================================

    const handleBackToMovie = () => {

        navigate(
            `/movies/${id}`
        );

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    Loading shows...
                </div>
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

                <div className="page-message">

                    <div>
                        <p>
                            {error}
                        </p>

                        <button
                            className="hero-button"
                            onClick={handleBackToMovie}
                        >
                            ← Back to Movie
                        </button>
                    </div>

                </div>
            </>
        );

    }


    // =========================================================
    // NO SHOWS
    // =========================================================

    if (shows.length === 0) {

        return (
            <>
                <Navbar />

                <main className="show-selection">

                    <div className="show-container">

                        <div className="show-header">

                            <p className="section-label">
                                SELECT YOUR SHOW
                            </p>

                            <h1>
                                {movie?.title ||
                                    "Movie Shows"}
                            </h1>

                        </div>


                        <div className="no-shows">

                            <div className="no-shows-icon">
                                🎬
                            </div>

                            <h2>
                                No shows available
                            </h2>

                            <p>
                                There are currently no active
                                shows available for this movie.
                            </p>

                            <button
                                className="hero-button"
                                onClick={handleBackToMovie}
                            >
                                ← Back to Movie
                            </button>

                        </div>

                    </div>

                </main>
            </>
        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <>
            <Navbar />

            <main className="show-selection">

                <div className="show-container">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="show-header">

                        <p className="section-label">
                            SELECT YOUR SHOW
                        </p>

                        <h1>
                            {movie?.title ||
                                "Movie Shows"}
                        </h1>

                        {movie && (

                            <div className="show-movie-meta">

                                {movie.genre && (
                                    <span>
                                        {movie.genre}
                                    </span>
                                )}

                                {movie.language && (
                                    <span>
                                        {movie.language}
                                    </span>
                                )}

                                {movie.duration && (
                                    <span>
                                        {movie.duration} min
                                    </span>
                                )}

                                {movie.rating && (
                                    <span>
                                        ⭐ {movie.rating}
                                    </span>
                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        THEATRES
                    ================================================= */}

                    <div className="theatres-show-list">

                        {groupedTheatres.map(
                            (theatre) => (

                                <section
                                    className="show-theatre-card"
                                    key={theatre.id}
                                >


                                    {/* =================================
                                        THEATRE HEADER
                                    ================================= */}

                                    <div className="show-theatre-header">

                                        <div className="show-theatre-icon">
                                            🎬
                                        </div>

                                        <div>

                                            <p className="section-label">
                                                THEATRE
                                            </p>

                                            <h2>
                                                {theatre.name}
                                            </h2>

                                            {theatre.address && (
                                                <p className="theatre-address">
                                                    {theatre.address}
                                                </p>
                                            )}

                                        </div>

                                    </div>


                                    {/* =================================
                                        SCREENS
                                    ================================= */}

                                    <div className="show-screens">

                                        {theatre.screens.map(
                                            (screen) => (

                                                <div
                                                    className="show-screen"
                                                    key={screen.id}
                                                >


                                                    {/* SCREEN HEADER */}

                                                    <div className="show-screen-header">

                                                        <div>

                                                            <p className="screen-label">
                                                                SCREEN
                                                            </p>

                                                            <h3>
                                                                🎞️{" "}
                                                                {screen.name}
                                                            </h3>

                                                        </div>

                                                    </div>


                                                    {/* DATES */}

                                                    <div className="show-dates">

                                                        {screen.dates.map(
                                                            (date) => (

                                                                <div
                                                                    className="show-date-group"
                                                                    key={getDateKey(
                                                                        date.date
                                                                    )}
                                                                >


                                                                    {/* DATE */}

                                                                    <div className="show-date-header">

                                                                        <span className="date-icon">
                                                                            📅
                                                                        </span>

                                                                        <div>

                                                                            <span>
                                                                                SHOW DATE
                                                                            </span>

                                                                            <strong>
                                                                                {formatDate(
                                                                                    date.date
                                                                                )}
                                                                            </strong>

                                                                        </div>

                                                                    </div>


                                                                    {/* SHOW TIMES */}

                                                                    <div className="show-time-grid">

                                                                        {date.shows.map(
                                                                            (show) => (

                                                                                <button
                                                                                    className="show-time-card"
                                                                                    key={show.id}
                                                                                    onClick={() =>
                                                                                        handleShowSelect(
                                                                                            show.id
                                                                                        )
                                                                                    }
                                                                                >

                                                                                    <div className="show-time-main">

                                                                                        <strong>
                                                                                            {formatTime(
                                                                                                show.startTime
                                                                                            )}
                                                                                        </strong>

                                                                                        <span>
                                                                                            ₹
                                                                                            {
                                                                                                show.price
                                                                                            }
                                                                                        </span>

                                                                                    </div>

                                                                                    <div className="show-time-action">
                                                                                        Select Seats →
                                                                                    </div>

                                                                                </button>

                                                                            )
                                                                        )}

                                                                    </div>

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </section>

                            )
                        )}

                    </div>


                    {/* =================================================
                        BACK BUTTON
                    ================================================= */}

                    <div className="show-back-wrapper">

                        <button
                            className="back-button"
                            onClick={handleBackToMovie}
                        >
                            ← Back to Movie
                        </button>

                    </div>

                </div>

            </main>
        </>
    );
}

export default ShowSelection;