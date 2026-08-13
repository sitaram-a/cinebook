import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function MovieDetailsNew() {

    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD MOVIE + SHOWS
    // =========================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                // Get movie

                const movieResponse =
                    await api.get(
                        `/movies/${movieId}`
                    );

                setMovie(movieResponse.data);


                // Get active shows for movie

                const showsResponse =
                    await api.get(
                        `/shows/movie/${movieId}/active`
                    );

                const activeShows =
                    showsResponse.data || [];


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
                    "Unable to load movie."
                );

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [movieId]);


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
                        Loading movie...
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
                                navigate("/movies")
                            }
                        >
                            ← Back to Movies
                        </button>

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

                    {/* BACK */}

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/movies")
                        }
                    >
                        ← Back to Movies
                    </button>


                    {/* MOVIE HEADER */}

                    <div className="movie-detail-header">

                        <div className="movie-detail-poster">

                            {movie?.posterUrl ? (

                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                />

                            ) : (

                                <div className="movie-poster-placeholder">
                                    🎬
                                </div>

                            )}

                        </div>


                        <div className="movie-detail-info">

                            <p className="section-label">
                                MOVIE
                            </p>

                            <h1>
                                {movie?.title}
                            </h1>


                            {movie?.genre && (

                                <p>
                                    🎭 {movie.genre}
                                </p>

                            )}


                            {movie?.language && (

                                <p>
                                    🌐 {movie.language}
                                </p>

                            )}


                            {movie?.rating !==
                                undefined &&
                                movie?.rating !== null && (

                                <p>
                                    ⭐ {movie.rating}
                                </p>

                            )}


                            {movie?.description && (

                                <p>
                                    {movie.description}
                                </p>

                            )}

                        </div>

                    </div>


                    {/* SHOWS */}

                    <div className="section-header">

                        <div>

                            <p className="section-label">
                                SHOWTIMES
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
                                shows for this movie.
                            </p>

                        </div>

                    ) : (

                        <div className="show-list">

                            {shows.map((show) => (

                                <div
                                    className="show-card"
                                    key={show.id}
                                >

                                    {/* THEATRE */}

                                    <div className="show-card-main">

                                        <p className="section-label">
                                            THEATRE
                                        </p>

                                        <h2>
                                            {show.screen
                                                ?.theatre
                                                ?.name ||
                                                "Theatre"}
                                        </h2>

                                        <p>
                                            {show.screen?.name ||
                                                "Screen"}
                                        </p>

                                    </div>


                                    {/* MOVIE */}

                                    <div className="show-time">

                                        <span>
                                            Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                show.startTime
                                            )}
                                        </strong>

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


                                    {/* SEATS */}

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

export default MovieDetailsNew;