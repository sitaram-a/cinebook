import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminSeats() {

    const navigate = useNavigate();

    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [seats, setSeats] = useState([]);

    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [selectedScreen, setSelectedScreen] = useState("");

    const [loading, setLoading] = useState(true);
    const [loadingScreens, setLoadingScreens] = useState(false);
    const [loadingSeats, setLoadingSeats] = useState(false);

    // Which panel is open: null | "single" | "bulk" | "price"
    const [activePanel, setActivePanel] = useState(null);
    const [editingSeat, setEditingSeat] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        seatNumber: "",
        rowName: "",
        seatType: "REGULAR",
        price: ""
    });

    const [bulkForm, setBulkForm] = useState({
        rows: "",
        seatsPerRow: "",
        seatType: "REGULAR",
        price: ""
    });

    const [priceForm, setPriceForm] = useState({
        seatType: "REGULAR",
        price: ""
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
            setSelectedScreen("");
            setSeats([]);

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

                if (response.data.length > 0) {

                    setSelectedScreen(
                        response.data[0].id.toString()
                    );

                } else {

                    setSelectedScreen("");
                    setSeats([]);

                }

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


    // Load seats when screen changes
    useEffect(() => {

        if (!selectedScreen) {

            setSeats([]);

            return;
        }

        const loadSeatsForScreen = async () => {

            try {

                setLoadingSeats(true);
                setError("");

                const response = await api.get(
                    `/seats/screen/${selectedScreen}`
                );

                setSeats(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load seats."
                );

            } finally {

                setLoadingSeats(false);

            }
        };

        loadSeatsForScreen();

    }, [selectedScreen]);


    const loadSeats = async () => {

        if (!selectedScreen) {
            return;
        }

        try {

            const response = await api.get(
                `/seats/screen/${selectedScreen}`
            );

            setSeats(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to refresh seats."
            );

        }

    };


    // =========================================================
    // SINGLE SEAT FORM
    // =========================================================

    const handleInputChange = (event) => {

        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));

    };


    const openAddForm = () => {

        setEditingSeat(null);

        setForm({
            seatNumber: "",
            rowName: "",
            seatType: "REGULAR",
            price: ""
        });

        setError("");
        setSuccess("");

        setActivePanel("single");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const openEditForm = (seat) => {

        setEditingSeat(seat);

        setForm({
            seatNumber: seat.seatNumber,
            rowName: seat.rowName,
            seatType: seat.seatType,
            price: seat.price
        });

        setError("");
        setSuccess("");

        setActivePanel("single");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const closePanel = () => {

        setActivePanel(null);
        setEditingSeat(null);

        setForm({
            seatNumber: "",
            rowName: "",
            seatType: "REGULAR",
            price: ""
        });

        setBulkForm({
            rows: "",
            seatsPerRow: "",
            seatType: "REGULAR",
            price: ""
        });

        setPriceForm({
            seatType: "REGULAR",
            price: ""
        });

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!form.seatNumber.trim()) {

            setError(
                "Seat number is required."
            );

            return;
        }

        if (!form.rowName.trim()) {

            setError(
                "Row name is required."
            );

            return;
        }

        if (!form.price || Number(form.price) <= 0) {

            setError(
                "Seat price must be greater than 0."
            );

            return;
        }

        if (!selectedScreen) {

            setError(
                "Please select a screen."
            );

            return;
        }


        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const request = {
                seatNumber: form.seatNumber.trim(),
                rowName: form.rowName.trim(),
                seatType: form.seatType,
                price: Number(form.price),
                screenId: Number(selectedScreen)
            };


            if (editingSeat) {

                await api.put(
                    `/seats/${editingSeat.id}`,
                    request
                );

                setSuccess(
                    "Seat updated successfully."
                );

            } else {

                await api.post(
                    "/seats",
                    request
                );

                setSuccess(
                    "Seat created successfully."
                );

            }


            await loadSeats();

            closePanel();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to save seat."
            );

        } finally {

            setSaving(false);

        }

    };


    const handleDelete = async (seatId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this seat?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.delete(
                `/seats/${seatId}`
            );

            setSeats((current) =>
                current.filter(
                    (seat) => seat.id !== seatId
                )
            );

            setSuccess(
                "Seat deleted successfully."
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to delete seat."
            );

        }

    };


    // =========================================================
    // BULK GENERATE / ADD SEATS
    // =========================================================

    const openBulkForm = () => {

        setBulkForm({
            rows: "",
            seatsPerRow: "",
            seatType: "REGULAR",
            price: ""
        });

        setError("");
        setSuccess("");

        setActivePanel("bulk");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const handleBulkChange = (event) => {

        const { name, value } = event.target;

        setBulkForm((current) => ({
            ...current,
            [name]: value
        }));

    };


    const handleBulkSubmit = async (event) => {

        event.preventDefault();

        if (!selectedScreen) {

            setError(
                "Please select a screen."
            );

            return;
        }

        if (!bulkForm.rows || Number(bulkForm.rows) <= 0) {

            setError(
                "Number of rows must be greater than 0."
            );

            return;
        }

        if (
            !bulkForm.seatsPerRow ||
            Number(bulkForm.seatsPerRow) <= 0
        ) {

            setError(
                "Seats per row must be greater than 0."
            );

            return;
        }

        if (!bulkForm.price || Number(bulkForm.price) <= 0) {

            setError(
                "Price must be greater than 0."
            );

            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const request = {
                screenId: Number(selectedScreen),
                rows: Number(bulkForm.rows),
                seatsPerRow: Number(bulkForm.seatsPerRow),
                seatType: bulkForm.seatType,
                price: Number(bulkForm.price)
            };

            const response = await api.post(
                "/seats/add-batch",
                request
            );

            setSuccess(
                `${response.data.length} seats added successfully.`
            );

            await loadSeats();

            closePanel();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to generate seats."
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // BULK UPDATE PRICE
    // =========================================================

    const openPriceForm = () => {

        setPriceForm({
            seatType: "REGULAR",
            price: ""
        });

        setError("");
        setSuccess("");

        setActivePanel("price");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const handlePriceChange = (event) => {

        const { name, value } = event.target;

        setPriceForm((current) => ({
            ...current,
            [name]: value
        }));

    };


    const handlePriceSubmit = async (event) => {

        event.preventDefault();

        if (!selectedScreen) {

            setError(
                "Please select a screen."
            );

            return;
        }

        if (!priceForm.price || Number(priceForm.price) <= 0) {

            setError(
                "Price must be greater than 0."
            );

            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const request = {
                seatType: priceForm.seatType,
                price: Number(priceForm.price)
            };

            const response = await api.put(
                `/seats/screen/${selectedScreen}/bulk-price`,
                request
            );

            setSuccess(
                `Updated price for ${response.data.length} ` +
                `${priceForm.seatType} seat(s).`
            );

            await loadSeats();

            closePanel();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to update prices."
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    Loading seats...
                </div>
            </>
        );

    }


    const seatCountByType = seats.reduce((acc, seat) => {

        acc[seat.seatType] = (acc[seat.seatType] || 0) + 1;

        return acc;

    }, {});


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
                                Seat Management
                            </h1>

                            <p>
                                Manage seats for each screen —
                                one at a time, or in bulk.
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


                    {/* THEATRE + SCREEN SELECTORS */}

                    <div className="admin-toolbar">

                        <div className="form-group">

                            <label>
                                Theatre
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


                        <div className="form-group">

                            <label>
                                Screen
                            </label>

                            <select
                                value={selectedScreen}
                                onChange={(event) =>
                                    setSelectedScreen(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    loadingScreens ||
                                    screens.length === 0
                                }
                            >

                                {screens.length === 0 ? (

                                    <option value="">
                                        No screens available
                                    </option>

                                ) : (

                                    screens.map((screen) => (

                                        <option
                                            key={screen.id}
                                            value={screen.id}
                                        >
                                            {screen.name}
                                        </option>

                                    ))

                                )}

                            </select>

                        </div>


                        <div className="admin-toolbar-actions">

                            <button
                                className="show-time admin-toolbar-button"
                                onClick={openAddForm}
                                disabled={!selectedScreen}
                            >
                                + Add Seat
                            </button>

                            <button
                                className="confirm-button admin-toolbar-button"
                                onClick={openBulkForm}
                                disabled={!selectedScreen}
                            >
                                ⚡ Bulk Generate
                            </button>

                            <button
                                className="trailer-button admin-toolbar-button"
                                onClick={openPriceForm}
                                disabled={
                                    !selectedScreen ||
                                    seats.length === 0
                                }
                            >
                                💰 Bulk Price
                            </button>

                        </div>

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


                    {/* SINGLE SEAT FORM */}

                    {activePanel === "single" && (

                        <div className="admin-form-card">

                            <div className="admin-form-header">

                                <h2>
                                    {editingSeat
                                        ? "Edit Seat"
                                        : "Add Single Seat"}
                                </h2>

                            </div>


                            <form
                                className="admin-movie-form"
                                onSubmit={handleSubmit}
                            >

                                <div className="form-group">

                                    <label>
                                        Seat Number
                                    </label>

                                    <input
                                        type="text"
                                        name="seatNumber"
                                        value={
                                            form.seatNumber
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Example: A1"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Row Name
                                    </label>

                                    <input
                                        type="text"
                                        name="rowName"
                                        value={
                                            form.rowName
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Example: A"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Seat Type
                                    </label>

                                    <select
                                        name="seatType"
                                        value={
                                            form.seatType
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    >

                                        <option value="REGULAR">
                                            Regular
                                        </option>

                                        <option value="PREMIUM">
                                            Premium
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            form.price
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Example: 180"
                                        min="1"
                                        step="0.01"
                                    />

                                </div>


                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="confirm-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingSeat
                                                ? "Update Seat"
                                                : "Create Seat"}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-booking-button"
                                        onClick={closePanel}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}


                    {/* BULK GENERATE / ADD SEATS FORM */}

                    {activePanel === "bulk" && (

                        <div className="admin-form-card">

                            <div className="admin-form-header">

                                <h2>
                                    Bulk Generate Seats
                                </h2>

                                <p className="admin-form-subtext">
                                    {seats.length === 0
                                        ? "This screen has no seats yet — rows will start at A."
                                        : `This screen already has ${seats.length} seats. ` +
                                          "New rows will continue after the existing ones " +
                                          "(existing seats are untouched)."}
                                </p>

                            </div>


                            <form
                                className="admin-movie-form"
                                onSubmit={handleBulkSubmit}
                            >

                                <div className="form-group">

                                    <label>
                                        Number of Rows
                                    </label>

                                    <input
                                        type="number"
                                        name="rows"
                                        value={
                                            bulkForm.rows
                                        }
                                        onChange={
                                            handleBulkChange
                                        }
                                        placeholder="Example: 3"
                                        min="1"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Seats Per Row
                                    </label>

                                    <input
                                        type="number"
                                        name="seatsPerRow"
                                        value={
                                            bulkForm.seatsPerRow
                                        }
                                        onChange={
                                            handleBulkChange
                                        }
                                        placeholder="Example: 10"
                                        min="1"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Seat Type
                                    </label>

                                    <select
                                        name="seatType"
                                        value={
                                            bulkForm.seatType
                                        }
                                        onChange={
                                            handleBulkChange
                                        }
                                    >

                                        <option value="REGULAR">
                                            Regular
                                        </option>

                                        <option value="PREMIUM">
                                            Premium
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Price Per Seat
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            bulkForm.price
                                        }
                                        onChange={
                                            handleBulkChange
                                        }
                                        placeholder="Example: 250"
                                        min="1"
                                        step="0.01"
                                    />

                                </div>


                                {bulkForm.rows &&
                                    bulkForm.seatsPerRow && (

                                    <div className="admin-form-preview full-width">
                                        This will create{" "}
                                        <strong>
                                            {Number(
                                                bulkForm.rows
                                            ) *
                                                Number(
                                                    bulkForm.seatsPerRow
                                                )}
                                        </strong>{" "}
                                        new {bulkForm.seatType.toLowerCase()}{" "}
                                        seats.
                                    </div>

                                )}


                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="confirm-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Generating..."
                                            : "Generate Seats"}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-booking-button"
                                        onClick={closePanel}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}


                    {/* BULK PRICE UPDATE FORM */}

                    {activePanel === "price" && (

                        <div className="admin-form-card">

                            <div className="admin-form-header">

                                <h2>
                                    Bulk Update Price
                                </h2>

                                <p className="admin-form-subtext">
                                    Change the price for every
                                    seat of a chosen type on
                                    this screen at once.
                                </p>

                            </div>


                            <form
                                className="admin-movie-form"
                                onSubmit={handlePriceSubmit}
                            >

                                <div className="form-group">

                                    <label>
                                        Seat Type
                                    </label>

                                    <select
                                        name="seatType"
                                        value={
                                            priceForm.seatType
                                        }
                                        onChange={
                                            handlePriceChange
                                        }
                                    >

                                        <option value="REGULAR">
                                            Regular{" "}
                                            {seatCountByType.REGULAR
                                                ? `(${seatCountByType.REGULAR})`
                                                : "(0)"}
                                        </option>

                                        <option value="PREMIUM">
                                            Premium{" "}
                                            {seatCountByType.PREMIUM
                                                ? `(${seatCountByType.PREMIUM})`
                                                : "(0)"}
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label>
                                        New Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            priceForm.price
                                        }
                                        onChange={
                                            handlePriceChange
                                        }
                                        placeholder="Example: 300"
                                        min="1"
                                        step="0.01"
                                    />

                                </div>


                                <div className="form-actions full-width">

                                    <button
                                        type="submit"
                                        className="confirm-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Updating..."
                                            : "Update Price"}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-booking-button"
                                        onClick={closePanel}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}


                    {/* SEATS */}

                    <div className="admin-list-section">

                        <div className="admin-list-header">

                            <div>

                                <p className="section-label">
                                    SCREEN LAYOUT
                                </p>

                                <h2>
                                    Seats
                                </h2>

                            </div>

                            <strong>
                                {seats.length} Seats
                                {seatCountByType.REGULAR
                                    ? ` · ${seatCountByType.REGULAR} Regular`
                                    : ""}
                                {seatCountByType.PREMIUM
                                    ? ` · ${seatCountByType.PREMIUM} Premium`
                                    : ""}
                            </strong>

                        </div>


                        {loadingSeats ? (

                            <div className="page-message">
                                Loading seats...
                            </div>

                        ) : seats.length === 0 ? (

                            <div className="no-bookings">

                                <h2>
                                    No seats found
                                </h2>

                                <p>
                                    This screen does not have
                                    any seats yet. Use Bulk
                                    Generate to add a full
                                    layout in one step.
                                </p>

                                <button
                                    className="hero-button"
                                    onClick={openBulkForm}
                                    disabled={!selectedScreen}
                                >
                                    ⚡ Bulk Generate Seats
                                </button>

                            </div>

                        ) : (

                            <div className="admin-seat-grid">

                                {seats.map((seat) => (

                                    <div
                                        className={
                                            seat.seatType ===
                                            "PREMIUM"
                                                ? "admin-seat-card premium"
                                                : "admin-seat-card"
                                        }
                                        key={seat.id}
                                    >

                                        <div className="admin-seat-card-top">

                                            <span className="admin-seat-number">
                                                {seat.seatNumber}
                                            </span>

                                            <span className="admin-seat-type">
                                                {seat.seatType}
                                            </span>

                                        </div>


                                        <div className="admin-seat-card-meta">

                                            <span>
                                                Row {seat.rowName}
                                            </span>

                                            <span>
                                                ₹{seat.price}
                                            </span>

                                        </div>


                                        <div className="admin-seat-card-actions">

                                            <button
                                                onClick={() =>
                                                    openEditForm(
                                                        seat
                                                    )
                                                }
                                                aria-label="Edit seat"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        seat.id
                                                    )
                                                }
                                                aria-label="Delete seat"
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

export default AdminSeats;