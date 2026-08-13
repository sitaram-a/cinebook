import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminShows() {

    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [shows, setShows] = useState([]);

    const [selectedTheatre, setSelectedTheatre] = useState("");

    const [editingShowId, setEditingShowId] = useState(null);

    const [form, setForm] = useState({
        movieId: "",
        screenId: "",
        startTime: "",
        endTime: "",
        price: "",
        active: true
    });

    const [loading, setLoading] = useState(false);
    const [loadingScreens, setLoadingScreens] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =========================================================
    // LOAD MOVIES, THEATRES AND SHOWS
    // =========================================================

    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            setError("");

            const [
                moviesResponse,
                theatresResponse,
                showsResponse
            ] = await Promise.all([

                api.get("/movies"),

                api.get("/theatres"),

                api.get("/shows")

            ]);


            setMovies(moviesResponse.data);

            setTheatres(theatresResponse.data);

            setShows(showsResponse.data);


            // Select first theatre automatically
            if (theatresResponse.data.length > 0) {

                setSelectedTheatre(
                    theatresResponse.data[0].id.toString()
                );

            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load movies, theatres or shows."
            );

        }

    };


    // =========================================================
    // LOAD SCREENS WHEN THEATRE CHANGES
    // =========================================================

    useEffect(() => {

        if (!selectedTheatre) {

            setScreens([]);

            setForm(current => ({
                ...current,
                screenId: ""
            }));

            return;
        }


        const loadScreens = async () => {

            try {

                setLoadingScreens(true);

                setError("");


                const response = await api.get(
                    `/screens/theatre/${selectedTheatre}`
                );


                setScreens(response.data);


                if (
                    editingShowId === null &&
                    response.data.length > 0
                ) {

                    setForm(current => ({
                        ...current,
                        screenId:
                            response.data[0].id.toString()
                    }));

                }

                if (response.data.length === 0) {

                    setForm(current => ({
                        ...current,
                        screenId: ""
                    }));

                }

            } catch (error) {

                console.error(error);

                setScreens([]);

                setForm(current => ({
                    ...current,
                    screenId: ""
                }));

                setError(
                    "Unable to load screens for this theatre."
                );

            } finally {

                setLoadingScreens(false);

            }

        };


        loadScreens();

    }, [selectedTheatre, editingShowId]);


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setForm(current => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

    };


    // =========================================================
    // FORMAT DATETIME FOR INPUT
    // =========================================================

    const formatDateTimeForInput = (dateTime) => {

        if (!dateTime) {
            return "";
        }

        return dateTime.substring(0, 16);

    };

    // =========================================================
    // FORMAT DATETIME FOR DISPLAY
    // =========================================================

    const formatDateTimeForDisplay = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        return new Date(dateTime).toLocaleString([], {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });

    };


    // =========================================================
    // EDIT SHOW
    // =========================================================

    const handleEdit = async (show) => {

        try {

            setMessage("");

            setError("");


            if (!show.screen) {

                setError(
                    "Screen information is not available for this show."
                );

                return;
            }


            if (!show.screen.theatre) {

                setError(
                    "Theatre information is not available for this show."
                );

                return;
            }


            const theatreId =
                show.screen.theatre.id;


            const screenId =
                show.screen.id;


            setEditingShowId(show.id);


            setSelectedTheatre(
                theatreId.toString()
            );


            setForm({
                movieId:
                    show.movie?.id
                        ? show.movie.id.toString()
                        : "",

                screenId:
                    screenId
                        ? screenId.toString()
                        : "",

                startTime:
                    formatDateTimeForInput(
                        show.startTime
                    ),

                endTime:
                    formatDateTimeForInput(
                        show.endTime
                    ),

                price:
                    show.price ?? "",

                active:
                    show.active ?? true
            });


            const response = await api.get(
                `/screens/theatre/${theatreId}`
            );


            setScreens(response.data);


            setForm(current => ({
                ...current,
                screenId: screenId.toString()
            }));


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load show for editing."
            );

        }

    };


    // =========================================================
    // CREATE / UPDATE SHOW
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setMessage("");

        setError("");


        if (!form.movieId) {

            setError(
                "Please select a movie."
            );

            setLoading(false);

            return;
        }


        if (!selectedTheatre) {

            setError(
                "Please select a theatre."
            );

            setLoading(false);

            return;
        }


        if (!form.screenId) {

            setError(
                "Please select a screen."
            );

            setLoading(false);

            return;
        }


        if (!form.startTime || !form.endTime) {

            setError(
                "Please select start and end time."
            );

            setLoading(false);

            return;
        }


        if (
            new Date(form.endTime) <=
            new Date(form.startTime)
        ) {

            setError(
                "End time must be after start time."
            );

            setLoading(false);

            return;
        }


        if (
            !form.price ||
            Number(form.price) <= 0
        ) {

            setError(
                "Please enter a valid show price."
            );

            setLoading(false);

            return;
        }


        const request = {

            movieId:
                Number(form.movieId),

            screenId:
                Number(form.screenId),

            startTime:
                form.startTime,

            endTime:
                form.endTime,

            price:
                Number(form.price),

            active:
                form.active

        };


        try {

            if (editingShowId !== null) {

                const response = await api.put(
                    `/shows/${editingShowId}`,
                    request
                );


                setMessage(
                    `Show #${response.data.id} updated successfully.`
                );


                setEditingShowId(null);


                setForm({
                    movieId: "",

                    screenId:
                        screens.length > 0
                            ? screens[0].id.toString()
                            : "",

                    startTime: "",

                    endTime: "",

                    price: "",

                    active: true
                });


                await loadShows();


            } else {

                const response = await api.post(
                    "/shows",
                    request
                );


                setMessage(
                    `Show created successfully. Show ID: ${response.data.id}`
                );


                setForm({
                    movieId: "",

                    screenId:
                        screens.length > 0
                            ? screens[0].id.toString()
                            : "",

                    startTime: "",

                    endTime: "",

                    price: "",

                    active: true
                });


                await loadShows();

            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                (
                    editingShowId !== null
                        ? "Unable to update show."
                        : "Unable to create show."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOAD SHOWS
    // =========================================================

    const loadShows = async () => {

        try {

            const response = await api.get(
                "/shows"
            );

            setShows(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to refresh shows."
            );

        }

    };


    // =========================================================
    // DELETE SHOW
    // =========================================================

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this show?"
            )
        ) {

            return;

        }


        try {

            setMessage("");

            setError("");


            await api.delete(
                `/shows/${id}`
            );


            setMessage(
                "Show deleted successfully."
            );


            if (editingShowId === id) {

                handleCancelEdit();

            }


            await loadShows();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to delete show."
            );

        }

    };


    // =========================================================
    // CANCEL EDIT
    // =========================================================

    const handleCancelEdit = () => {

        setEditingShowId(null);

        setForm({
            movieId: "",

            screenId:
                screens.length > 0
                    ? screens[0].id.toString()
                    : "",

            startTime: "",

            endTime: "",

            price: "",

            active: true
        });

        setMessage("");

        setError("");

    };


    // =========================================================
    // RENDER
    // =========================================================

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
                                Manage Shows
                            </h1>

                            <p>
                                Create and manage movie shows
                                across theatres and screens.
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


                    {/* MESSAGES */}

                    {message && (

                        <div className="admin-success">
                            {message}
                        </div>

                    )}


                    {error && (

                        <div className="admin-error">
                            {error}
                        </div>

                    )}


                    {/* CREATE / EDIT SHOW FORM */}

                    <div className="admin-form-card">

                        <div className="admin-form-header">

                            <h2>
                                {editingShowId !== null
                                    ? `Edit Show #${editingShowId}`
                                    : "Create New Show"
                                }
                            </h2>

                        </div>


                        <form
                            className="admin-movie-form"
                            onSubmit={handleSubmit}
                        >


                            {/* MOVIE */}

                            <div className="form-group">

                                <label>
                                    Movie
                                </label>

                                <select
                                    name="movieId"
                                    value={form.movieId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Movie
                                    </option>

                                    {movies.map(movie => (

                                        <option
                                            key={movie.id}
                                            value={movie.id}
                                        >
                                            {movie.title}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* THEATRE */}

                            <div className="form-group">

                                <label>
                                    Theatre
                                </label>

                                <select
                                    value={selectedTheatre}
                                    onChange={(e) =>
                                        setSelectedTheatre(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Theatre
                                    </option>

                                    {theatres.map(theatre => (

                                        <option
                                            key={theatre.id}
                                            value={theatre.id}
                                        >
                                            {theatre.name}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* SCREEN */}

                            <div className="form-group">

                                <label>
                                    Screen
                                </label>

                                <select
                                    name="screenId"
                                    value={form.screenId}
                                    onChange={handleChange}
                                    disabled={
                                        loadingScreens ||
                                        screens.length === 0
                                    }
                                    required
                                >

                                    {loadingScreens ? (

                                        <option value="">
                                            Loading screens...
                                        </option>

                                    ) : screens.length === 0 ? (

                                        <option value="">
                                            No screens available
                                        </option>

                                    ) : (

                                        <>

                                            <option value="">
                                                Select Screen
                                            </option>

                                            {screens.map(screen => (

                                                <option
                                                    key={screen.id}
                                                    value={screen.id}
                                                >
                                                    {screen.name}
                                                </option>

                                            ))}

                                        </>

                                    )}

                                </select>

                            </div>


                            {/* START TIME */}

                            <div className="form-group">

                                <label>
                                    Start Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* END TIME */}

                            <div className="form-group">

                                <label>
                                    End Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* PRICE */}

                            <div className="form-group">

                                <label>
                                    Show Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    min="1"
                                    step="0.01"
                                    placeholder="180"
                                    required
                                />

                            </div>


                            {/* ACTIVE */}

                            <div className="form-group full-width checkbox-group">

                                <label className="checkbox-label">

                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={form.active}
                                        onChange={handleChange}
                                    />

                                    <span className="checkbox-box" />

                                    Active Show

                                </label>

                            </div>


                            {/* BUTTONS */}

                            <div className="form-actions">

                                <button
                                    type="submit"
                                    className="confirm-button"
                                    disabled={
                                        loading ||
                                        !selectedTheatre ||
                                        screens.length === 0
                                    }
                                >

                                    {loading

                                        ? (
                                            editingShowId !== null
                                                ? "Updating..."
                                                : "Creating..."
                                        )

                                        : (
                                            editingShowId !== null
                                                ? "Update Show"
                                                : "Create Show"
                                        )

                                    }

                                </button>


                                {editingShowId !== null && (

                                    <button
                                        type="button"
                                        className="cancel-booking-button canc"
                                        onClick={
                                            handleCancelEdit
                                        }
                                    >
                                        Cancel Edit
                                    </button>

                                )}

                            </div>

                        </form>

                    </div>


                    {/* SHOW LIST */}

                    <div className="admin-list-section">

                        <div className="admin-list-header">

                            <div>

                                <p className="section-label">
                                    SCREENING SCHEDULE
                                </p>

                                <h2>
                                    Existing Shows
                                </h2>

                            </div>

                            <strong>
                                {shows.length} Shows
                            </strong>

                        </div>


                        {shows.length === 0 ? (

                            <div className="no-bookings">

                                <h2>
                                    No shows found
                                </h2>

                                <p>
                                    Create your first show
                                    using the form above.
                                </p>

                            </div>

                        ) : (

                            <div className="admin-table-wrapper">

                                <table className="admin-table">

                                    <thead>

                                        <tr>
                                            <th>ID</th>
                                            <th>Movie</th>
                                            <th>Theatre</th>
                                            <th>Screen</th>
                                            <th>Start</th>
                                            <th>End</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {shows.map(show => (

                                            <tr key={show.id}>

                                                <td
                                                    className="admin-table-id"
                                                >
                                                    #{show.id}
                                                </td>

                                                <td
                                                    className="admin-table-primary"
                                                >
                                                    {
                                                        show.movie?.title ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        show.screen
                                                            ?.theatre
                                                            ?.name ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        show.screen?.name ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td
                                                    className="admin-table-mono"
                                                >
                                                    {formatDateTimeForDisplay(
                                                        show.startTime
                                                    )}
                                                </td>

                                                <td
                                                    className="admin-table-mono"
                                                >
                                                    {formatDateTimeForDisplay(
                                                        show.endTime
                                                    )}
                                                </td>

                                                <td
                                                    className="admin-table-mono"
                                                >
                                                    ₹{show.price}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            show.active
                                                                ? "status-pill status-pill-active"
                                                                : "status-pill status-pill-inactive"
                                                        }
                                                    >
                                                        {show.active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="admin-table-actions">

                                                        <button
                                                            className="show-time"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    show
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="cancel-booking-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    show.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </main>
        </>
    );
}

export default AdminShows;