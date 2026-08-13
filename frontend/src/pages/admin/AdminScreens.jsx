import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminScreens() {

    const navigate = useNavigate();

    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);

    const [selectedTheatre, setSelectedTheatre] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingScreens, setLoadingScreens] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingScreen, setEditingScreen] = useState(null);

    const [form, setForm] = useState({
        name: "",
        totalSeats: ""
    });


    // Load theatres
    useEffect(() => {

        const loadTheatres = async () => {

            try {

                const response = await api.get("/theatres");

                setTheatres(response.data);

                if (response.data.length > 0) {
                    setSelectedTheatre(
                        response.data[0].id.toString()
                    );
                }

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load theatres."
                );

            } finally {

                setLoading(false);

            }
        };

        loadTheatres();

    }, []);


    // Load screens when theatre changes
    useEffect(() => {

        if (!selectedTheatre) {
            setScreens([]);
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

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load screens."
                );

            } finally {

                setLoadingScreens(false);

            }
        };

        loadScreens();

    }, [selectedTheatre]);


    const handleInputChange = (event) => {

        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));

    };


    const openAddForm = () => {

        setEditingScreen(null);

        setForm({
            name: "",
            totalSeats: ""
        });

        setError("");
        setSuccess("");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const openEditForm = (screen) => {

        setEditingScreen(screen);

        setForm({
            name: screen.name,
            totalSeats: screen.totalSeats
        });

        setError("");
        setSuccess("");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const closeForm = () => {

        setShowForm(false);
        setEditingScreen(null);

        setForm({
            name: "",
            totalSeats: ""
        });

    };


    const loadScreens = async () => {

        if (!selectedTheatre) {
            return;
        }

        const response = await api.get(
            `/screens/theatre/${selectedTheatre}`
        );

        setScreens(response.data);

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!form.name.trim()) {

            setError(
                "Screen name is required."
            );

            return;
        }

        if (!form.totalSeats || Number(form.totalSeats) <= 0) {

            setError(
                "Total seats must be greater than 0."
            );

            return;
        }

        try {

            setError("");
            setSuccess("");

            const request = {
                name: form.name.trim(),
                totalSeats: Number(form.totalSeats),
                theatreId: Number(selectedTheatre)
            };


            if (editingScreen) {

                await api.put(
                    `/screens/${editingScreen.id}`,
                    request
                );

                setSuccess(
                    "Screen updated successfully."
                );

            } else {

                await api.post(
                    "/screens",
                    request
                );

                setSuccess(
                    "Screen created successfully."
                );
            }


            await loadScreens();

            closeForm();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to save screen."
            );

        }

    };


    const handleDelete = async (screenId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this screen?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.delete(
                `/screens/${screenId}`
            );

            setScreens((current) =>
                current.filter(
                    (screen) =>
                        screen.id !== screenId
                )
            );

            setSuccess(
                "Screen deleted successfully."
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to delete screen."
            );

        }

    };


    if (loading) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    Loading screens...
                </div>
            </>
        );

    }


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
                                Screen Management
                            </h1>

                            <p>
                                Manage screens for each theatre.
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


                    {/* THEATRE SELECTOR */}

                    <div className="admin-toolbar">

                        <div className="form-group">

                            <label>
                                Select Theatre
                            </label>

                            <select
                                value={selectedTheatre}
                                onChange={(event) =>
                                    setSelectedTheatre(
                                        event.target.value
                                    )
                                }
                            >

                                {theatres.map((theatre) => (

                                    <option
                                        key={theatre.id}
                                        value={theatre.id}
                                    >
                                        {theatre.name}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <button
                            className="confirm-button admin-toolbar-button"
                            onClick={openAddForm}
                            disabled={!selectedTheatre}
                        >
                            + Add Screen
                        </button>

                    </div>


                    {/* MESSAGES */}

                    {error && (
                        <div className="admin-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="admin-success">
                            {success}
                        </div>
                    )}


                    {/* FORM */}

                    {showForm && (

                        <div className="admin-form-card">

                            <div className="admin-form-header">

                                <h2>
                                    {editingScreen
                                        ? "Edit Screen"
                                        : "Add Screen"}
                                </h2>

                            </div>


                            <form
                                className="admin-movie-form"
                                onSubmit={handleSubmit}
                            >

                                <div className="form-group">

                                    <label>
                                        Screen Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="e.g. Screen 1"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Total Seats
                                    </label>

                                    <input
                                        type="number"
                                        name="totalSeats"
                                        value={
                                            form.totalSeats
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="e.g. 100"
                                        min="1"
                                    />

                                </div>


                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="confirm-button"
                                    >
                                        {editingScreen
                                            ? "Update Screen"
                                            : "Create Screen"}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-booking-button canc"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}


                    {/* SCREEN LIST */}

                    <div className="admin-list-section">

                        <div className="admin-list-header">

                            <div>

                                <p className="section-label">
                                    SCREENS
                                </p>

                                <h2>
                                    {theatres.find(
                                        (t) =>
                                            t.id.toString() ===
                                            selectedTheatre
                                    )?.name || "Screens"}
                                </h2>

                            </div>

                            <strong>
                                {screens.length} Screens
                            </strong>

                        </div>


                        {loadingScreens ? (

                            <div className="page-message">
                                Loading screens...
                            </div>

                        ) : screens.length === 0 ? (

                            <div className="no-bookings">

                                <h2>
                                    No screens found
                                </h2>

                                <p>
                                    This theatre does not have
                                    any screens yet.
                                </p>

                                <button
                                    className="hero-button"
                                    onClick={openAddForm}
                                >
                                    + Add First Screen
                                </button>

                            </div>

                        ) : (

                            <div className="admin-list">

                                {screens.map((screen) => (

                                    <div
                                        className="admin-list-card"
                                        key={screen.id}
                                    >

                                        <div className="admin-list-card-icon">
                                            🖥️
                                        </div>


                                        <div className="admin-list-card-info">

                                            <p className="section-label">
                                                SCREEN
                                            </p>

                                            <h2>
                                                {screen.name}
                                            </h2>

                                            <p>
                                                Total Seats:{" "}
                                                <strong>
                                                    {screen.totalSeats}
                                                </strong>
                                            </p>

                                        </div>


                                        <div className="admin-list-actions">

                                            <button
                                                className="show-time"
                                                onClick={() =>
                                                    openEditForm(
                                                        screen
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="cancel-booking-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        screen.id
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

export default AdminScreens;