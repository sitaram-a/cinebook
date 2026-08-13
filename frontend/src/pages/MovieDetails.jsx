import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function MovieDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        api.get(`/movies/${id}`)
            .then((response) => {
                setMovie(response.data);
            })
            .catch((error) => {
                console.error(error);
                setError("Unable to load movie");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [id]);


    // ==========================================
    // FORMAT RELEASE DATE
    // ==========================================

    const formatReleaseDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString([], {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };


    // ==========================================
    // CONVERT YOUTUBE URL TO EMBED URL
    // ==========================================

    const getTrailerEmbedUrl = (url) => {

        if (!url) {
            return null;
        }

        try {

            const parsedUrl = new URL(url);

            // Example:
            // https://www.youtube.com/watch?v=ABC123

            if (
                parsedUrl.hostname.includes("youtube.com") &&
                parsedUrl.searchParams.get("v")
            ) {

                const videoId =
                    parsedUrl.searchParams.get("v");

                return `https://www.youtube.com/embed/${videoId}`;
            }


            // Example:
            // https://youtu.be/ABC123

            if (
                parsedUrl.hostname === "youtu.be"
            ) {

                const videoId =
                    parsedUrl.pathname.substring(1);

                return `https://www.youtube.com/embed/${videoId}`;
            }


            // Already an embed URL

            if (
                parsedUrl.hostname.includes("youtube.com") &&
                parsedUrl.pathname.startsWith("/embed/")
            ) {

                return url;
            }

            return null;

        } catch (error) {

            console.error(
                "Invalid trailer URL:",
                error
            );

            return null;
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    Loading movie...
                </div>
            </>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !movie) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    {error || "Movie not found"}
                </div>
            </>
        );
    }


    const trailerEmbedUrl =
        getTrailerEmbedUrl(movie.trailerUrl);


    // ==========================================
    // MOVIE DETAILS
    // ==========================================

    return (
        <>
            <Navbar />

            <main className="movie-details">

                <div className="movie-details-container">


                    {/* ==================================
                        POSTER
                    ================================== */}

                    <div className="details-poster">

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


                    {/* ==================================
                        TRAILER
                    ================================== */}

                    <div className="details-trailer">

                        {trailerEmbedUrl ? (

                            <iframe
                                src={trailerEmbedUrl}
                                title={`${movie.title} Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />

                        ) : (

                            <div className="trailer-placeholder">

                                <div>
                                    🎬
                                </div>

                                <p>
                                    Trailer not available
                                </p>

                            </div>

                        )}

                    </div>


                    {/* ==================================
                        CONTENT
                    ================================== */}

                    <div className="details-content">

                        <p className="section-label">
                            MOVIE
                        </p>


                        <h1>
                            {movie.title}
                        </h1>


                        {/* RATING */}

                        <div className="details-rating">

                            ⭐ {movie.rating || "N/A"}

                        </div>


                        {/* GENRE + LANGUAGE */}

                        <div className="details-meta">

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

                        </div>


                        {/* DESCRIPTION */}

                        <p className="details-description">

                            {movie.description}

                        </p>


                        {/* EXTRA INFORMATION */}

                        <div className="movie-extra-info">

                            <div>

                                <span>
                                    Release Date
                                </span>

                                <strong>
                                    {formatReleaseDate(
                                        movie.releaseDate
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Duration
                                </span>

                                <strong>
                                    {movie.duration
                                        ? `${movie.duration} minutes`
                                        : "N/A"}
                                </strong>

                            </div>

                        </div>


                        {/* BUTTON */}

                        <div className="movie-actions">

                            <button
                                className="hero-button"
                                onClick={() =>
                                    navigate(
                                        `/movies/${movie.id}/shows`
                                    )
                                }
                            >
                                Select Theatre & Show
                            </button>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    ABOUT MOVIE
                ================================== */}

                <section className="movie-about">

                    <p className="section-label">
                        ABOUT THE MOVIE
                    </p>

                    <h2>
                        {movie.title}
                    </h2>

                    <p>
                        {movie.description}
                    </p>

                </section>

            </main>
        </>
    );
}

export default MovieDetails;