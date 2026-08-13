import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminMovies() {

    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingMovie, setEditingMovie] = useState(null);

    const emptyForm = {
        title: "",
        description: "",
        genre: "",
        language: "",
        duration: "",
        releaseDate: "",
        posterUrl: "",
        trailerUrl: "",
        rating: ""
    };

    const [form, setForm] = useState(emptyForm);


    // =========================
    // LOAD MOVIES
    // =========================

    const loadMovies = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/movies");

            setMovies(response.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load movies"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadMovies();

    }, []);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));

    };


    // =========================
    // ADD MOVIE
    // =========================

    const handleAddMovie = () => {

        setEditingMovie(null);
        setForm(emptyForm);

        setError("");
        setSuccess("");

    };


    // =========================
    // EDIT MOVIE
    // =========================

    const handleEditMovie = (movie) => {

        setEditingMovie(movie);

        setForm({
            title: movie.title || "",
            description: movie.description || "",
            genre: movie.genre || "",
            language: movie.language || "",
            duration: movie.duration || "",
            releaseDate: movie.releaseDate || "",
            posterUrl: movie.posterUrl || "",
            trailerUrl: movie.trailerUrl || "",
            rating: movie.rating ?? ""
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =========================
    // SAVE MOVIE
    // =========================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const movieRequest = {
                title: form.title,
                description: form.description,
                genre: form.genre,
                language: form.language,
                duration: Number(form.duration),
                releaseDate: form.releaseDate,
                posterUrl: form.posterUrl,
                trailerUrl: form.trailerUrl,
                rating: Number(form.rating)
            };


            if (editingMovie) {

                await api.put(
                    `/movies/${editingMovie.id}`,
                    movieRequest
                );

                setSuccess(
                    "Movie updated successfully."
                );

            } else {

                await api.post(
                    "/movies",
                    movieRequest
                );

                setSuccess(
                    "Movie added successfully."
                );

            }

            setForm(emptyForm);
            setEditingMovie(null);

            await loadMovies();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to save movie"
            );

        } finally {

            setSaving(false);

        }
    };


    // =========================
    // DELETE MOVIE
    // =========================

    const handleDeleteMovie = async (movieId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this movie?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.delete(
                `/movies/${movieId}`
            );

            setSuccess(
                "Movie deleted successfully."
            );

            await loadMovies();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to delete movie"
            );

        }
    };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancelEdit = () => {

        setEditingMovie(null);
        setForm(emptyForm);

        setError("");
        setSuccess("");

    };


    return (
        <>
            <Navbar />

            <main className="admin-page">

                <div className="admin-container">


                    {/* HEADER */}

                    <div className="admin-header">

                        <div>

                            <p className="section-label">
                                ADMINISTRATION
                            </p>

                            <h1>
                                Manage Movies
                            </h1>

                            <p>
                                Add, edit and remove movies
                                from CineBook.
                            </p>

                        </div>


                        <button
                            className="hero-button"
                            onClick={() =>
                                navigate("/admin")
                            }
                        >
                            ← Dashboard
                        </button>

                    </div>


                    {/* SUCCESS */}

                    {success && (

                        <div className="admin-success">
                            {success}
                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div className="admin-error">
                            {error}
                        </div>

                    )}


                    {/* MOVIE FORM */}

                    <div className="admin-form-card">

                        <div className="admin-form-header">

                            <h2>
                                {editingMovie
                                    ? "Edit Movie"
                                    : "Add New Movie"}
                            </h2>

                        </div>


                        <form
                            className="admin-movie-form"
                            onSubmit={handleSubmit}
                        >


                            {/* TITLE */}

                            <div className="form-group">

                                <label>
                                    Movie Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter movie title"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter movie description"
                                    rows="4"
                                    required
                                />

                            </div>


                            {/* GENRE */}

                            <div className="form-group">

                                <label>
                                    Genre
                                </label>

                                <input
                                    type="text"
                                    name="genre"
                                    value={form.genre}
                                    onChange={handleChange}
                                    placeholder="Action"
                                    required
                                />

                            </div>


                            {/* LANGUAGE */}

                            <div className="form-group">

                                <label>
                                    Language
                                </label>

                                <input
                                    type="text"
                                    name="language"
                                    value={form.language}
                                    onChange={handleChange}
                                    placeholder="English"
                                    required
                                />

                            </div>


                            {/* DURATION */}

                            <div className="form-group">

                                <label>
                                    Duration (minutes)
                                </label>

                                <input
                                    type="number"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleChange}
                                    placeholder="180"
                                    min="1"
                                    required
                                />

                            </div>


                            {/* RELEASE DATE */}

                            <div className="form-group">

                                <label>
                                    Release Date
                                </label>

                                <input
                                    type="date"
                                    name="releaseDate"
                                    value={form.releaseDate}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* RATING */}

                            <div className="form-group">

                                <label>
                                    Rating
                                </label>

                                <input
                                    type="number"
                                    name="rating"
                                    value={form.rating}
                                    onChange={handleChange}
                                    placeholder="8.4"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    required
                                />

                            </div>


                            {/* POSTER URL */}

                            <div className="form-group">

                                <label>
                                    Poster URL
                                </label>

                                <input
                                    type="url"
                                    name="posterUrl"
                                    value={form.posterUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/poster.jpg"
                                />

                            </div>


                            {/* TRAILER URL */}

                            <div className="form-group full-width">

                                <label>
                                    Trailer URL
                                </label>

                                <input
                                    type="url"
                                    name="trailerUrl"
                                    value={form.trailerUrl}
                                    onChange={handleChange}
                                    placeholder="https://youtube.com/watch?v=..."
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="form-actions">

                                <button
                                    type="submit"
                                    className="confirm-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingMovie
                                            ? "Update Movie"
                                            : "Add Movie"}
                                </button>


                                {editingMovie && (

                                    <button
                                        type="button"
                                        className="cancel-booking-button"
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                    >
                                        Cancel Edit
                                    </button>

                                )}

                            </div>

                        </form>

                    </div>


                    {/* MOVIE LIST */}

                    <div className="admin-list-section">

                        <div className="admin-list-header">

                            <div>

                                <p className="section-label">
                                    MOVIE LIBRARY
                                </p>

                                <h2>
                                    All Movies
                                </h2>

                            </div>

                            <strong>
                                {movies.length} Movies
                            </strong>

                        </div>


                        {loading && (

                            <div className="page-message">
                                Loading movies...
                            </div>

                        )}


                        {!loading &&
                            movies.length === 0 && (

                                <div className="no-bookings">

                                    <h2>
                                        No movies found
                                    </h2>

                                    <p>
                                        Add your first movie
                                        using the form above.
                                    </p>

                                </div>

                            )}


                        {!loading &&
                            movies.length > 0 && (

                                <div className="admin-movie-list">

                                    {movies.map((movie) => (

                                        <div
                                            className="admin-movie-card"
                                            key={movie.id}
                                        >


                                            {/* POSTER */}

                                            <div className="admin-movie-poster">

                                                {movie.posterUrl ? (

                                                    <img
                                                        src={movie.posterUrl}
                                                        alt={movie.title}
                                                    />

                                                ) : (

                                                    <div>
                                                        🎬
                                                    </div>

                                                )}

                                            </div>


                                            {/* DETAILS */}

                                            <div className="admin-movie-info">

                                                <p className="section-label">
                                                    MOVIE #{movie.id}
                                                </p>

                                                <h2>
                                                    {movie.title}
                                                </h2>

                                                <p>
                                                    {movie.description}
                                                </p>


                                                <div className="admin-movie-meta">

                                                    <span>
                                                        🎭 {movie.genre}
                                                    </span>

                                                    <span>
                                                        🌐 {movie.language}
                                                    </span>

                                                    <span>
                                                        ⏱️ {movie.duration} min
                                                    </span>

                                                    <span>
                                                        ⭐ {movie.rating}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="admin-movie-actions">

                                                <button
                                                    className="show-time"
                                                    onClick={() =>
                                                        handleEditMovie(movie)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="cancel-booking-button"
                                                    onClick={() =>
                                                        handleDeleteMovie(
                                                            movie.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                    </div>

                </div>

            </main>
        </>
    );
}

export default AdminMovies;