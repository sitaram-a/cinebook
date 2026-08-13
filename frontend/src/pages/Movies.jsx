import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Movies() {

    const navigate = useNavigate();

    // =========================================================
    // SPLIT A COMMA-SEPARATED FIELD INTO A SHORT DISPLAY LIST
    // e.g. "Hindi, Telugu, Tamil, Malayalam" -> "Hindi" + "+3"
    // =========================================================

    const splitList = (value) => {

        if (!value) {
            return [];
        }

        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

    };

    const [movies, setMovies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Track which movie cards have their genre / language
    // pills expanded to show the full list.
    const [expandedGenres, setExpandedGenres] = useState(new Set());
    const [expandedLanguages, setExpandedLanguages] = useState(new Set());

    const toggleExpanded = (setFn, movieId) => {

        setFn((current) => {

            const next = new Set(current);

            if (next.has(movieId)) {
                next.delete(movieId);
            } else {
                next.add(movieId);
            }

            return next;

        });

    };


    // =========================================================
    // LOAD MOVIES
    // =========================================================

    useEffect(() => {

        const loadMovies = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/movies");

                setMovies(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load movies."
                );

            } finally {

                setLoading(false);

            }

        };

        loadMovies();

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
                        Loading movies...
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
                            className="confirm-button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
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

                    {/* HEADER */}

                    <div className="page-header">

                        <p className="section-label">
                            CINEBOOK
                        </p>

                        <h1>
                            Movies
                        </h1>

                        <p>
                            Discover movies and book your
                            favourite show.
                        </p>

                    </div>


                    {/* MOVIES */}

                    {movies.length === 0 ? (

                        <div className="no-bookings">

                            <h2>
                                No movies available
                            </h2>

                            <p>
                                There are currently no movies
                                available. Check back soon.
                            </p>

                        </div>

                    ) : (

                        <div className="movie-grid">

                            {movies.map((movie) => (

                                <div
                                    className="movie-card"
                                    key={movie.id}
                                >

                                    {/* POSTER */}

                                    <div className="movie-poster">

                                        {movie.posterUrl ? (

                                            <img
                                                src={movie.posterUrl}
                                                alt={movie.title}
                                            />

                                        ) : (

                                            <div className="poster-placeholder">
                                                🎬
                                            </div>

                                        )}

                                    </div>


                                    {/* DETAILS */}

                                    <div className="movie-info">

                                        <h3>
                                            {movie.title}
                                        </h3>


                                        <div className="movie-meta">

                                            {movie.rating !==
                                                undefined &&
                                                movie.rating !==
                                                    null && (
                                                <span className="meta-pill meta-pill-rating">
                                                    ⭐ {movie.rating}
                                                </span>
                                            )}

                                            {(() => {

                                                const genres =
                                                    splitList(
                                                        movie.genre
                                                    );

                                                const isExpanded =
                                                    expandedGenres.has(
                                                        movie.id
                                                    );

                                                const visibleGenres =
                                                    isExpanded
                                                        ? genres
                                                        : genres.slice(
                                                              0,
                                                              1
                                                          );

                                                return (

                                                    <>

                                                        {visibleGenres.map(
                                                            (genre) => (

                                                                <span
                                                                    className="meta-pill"
                                                                    key={
                                                                        genre
                                                                    }
                                                                >
                                                                    🎭{" "}
                                                                    {genre}
                                                                </span>

                                                            )
                                                        )}

                                                        {genres.length >
                                                            1 && (

                                                            <button
                                                                type="button"
                                                                className="meta-pill meta-pill-more"
                                                                onClick={() =>
                                                                    toggleExpanded(
                                                                        setExpandedGenres,
                                                                        movie.id
                                                                    )
                                                                }
                                                            >

                                                                {isExpanded
                                                                    ? "Show less"
                                                                    : `+${
                                                                          genres.length -
                                                                          1
                                                                      }`}

                                                            </button>

                                                        )}

                                                    </>

                                                );

                                            })()}

                                            {(() => {

                                                const languages =
                                                    splitList(
                                                        movie.language
                                                    );

                                                const isExpanded =
                                                    expandedLanguages.has(
                                                        movie.id
                                                    );

                                                const visibleLanguages =
                                                    isExpanded
                                                        ? languages
                                                        : languages.slice(
                                                              0,
                                                              1
                                                          );

                                                return (

                                                    <>

                                                        {visibleLanguages.map(
                                                            (
                                                                language
                                                            ) => (

                                                                <span
                                                                    className="meta-pill"
                                                                    key={
                                                                        language
                                                                    }
                                                                >
                                                                    🌐{" "}
                                                                    {
                                                                        language
                                                                    }
                                                                </span>

                                                            )
                                                        )}

                                                        {languages.length >
                                                            1 && (

                                                            <button
                                                                type="button"
                                                                className="meta-pill meta-pill-more"
                                                                onClick={() =>
                                                                    toggleExpanded(
                                                                        setExpandedLanguages,
                                                                        movie.id
                                                                    )
                                                                }
                                                            >

                                                                {isExpanded
                                                                    ? "Show less"
                                                                    : `+${
                                                                          languages.length -
                                                                          1
                                                                      }`}

                                                            </button>

                                                        )}

                                                    </>

                                                );

                                            })()}

                                        </div>


                                        {/* BOOK */}

                                        <button
                                            className="book-button"
                                            onClick={() =>
                                                navigate(
                                                    `/movies/${movie.id}`
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

export default Movies;