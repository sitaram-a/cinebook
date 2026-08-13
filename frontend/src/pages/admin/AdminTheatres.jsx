import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminTheatres() {

    const [theatres, setTheatres] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        address: "",
        city: "",
        totalScreens: ""
    });

    useEffect(() => {
        loadTheatres();
    }, []);

    const loadTheatres = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/theatres");

            setTheatres(response.data);

        } catch (error) {

            console.error(error);

            setError("Unable to load theatres");

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    };

    const resetForm = () => {

        setForm({
            name: "",
            address: "",
            city: "",
            totalScreens: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setError("");

            const theatreData = {
                name: form.name,
                address: form.address,
                city: form.city,
                totalScreens: Number(form.totalScreens)
            };

            if (editingId) {

                await api.put(
                    `/theatres/${editingId}`,
                    theatreData
                );

            } else {

                await api.post(
                    "/theatres",
                    theatreData
                );
            }

            await loadTheatres();

            resetForm();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to save theatre"
            );

        }
    };

    const handleEdit = (theatre) => {

        setForm({
            name: theatre.name || "",
            address: theatre.address || "",
            city: theatre.city || "",
            totalScreens: theatre.totalScreens || ""
        });

        setEditingId(theatre.id);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this theatre?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await api.delete(`/theatres/${id}`);

            await loadTheatres();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to delete theatre"
            );
        }
    };

    return (
        <>
            <Navbar />

            <main className="admin-page">

                <div className="admin-container">

                    <div className="admin-header">

                        <div>
                            <p className="section-label">
                                ADMINISTRATION
                            </p>

                            <h1>
                                Theatre Management
                            </h1>

                            <p>
                                Add, edit and manage CineBook theatres.
                            </p>
                        </div>

                        <button
                            className="hero-button"
                            onClick={() => {

                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }

                            }}
                        >
                            {showForm
                                ? "Cancel"
                                : "+ Add Theatre"}
                        </button>

                    </div>


                    {error && (
                        <div className="admin-error">
                            {error}
                        </div>
                    )}


                    {showForm && (

                        <div className="admin-form-card">

                            <h2>
                                {editingId
                                    ? "Edit Theatre"
                                    : "Add Theatre"}
                            </h2>

                            <form onSubmit={handleSubmit}>

                                <div className="admin-form-grid">

                                    <div className="form-group">

                                        <label>
                                            Theatre Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="CineBook Central"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="Bengaluru"
                                            required
                                        />

                                    </div>


                                    <div className="form-group full-width">

                                        <label>
                                            Address
                                        </label>

                                        <input
                                            type="text"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="MG Road, Bengaluru"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Total Screens
                                        </label>

                                        <input
                                            type="number"
                                            name="totalScreens"
                                            value={form.totalScreens}
                                            onChange={handleChange}
                                            min="1"
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        className="hero-button"
                                    >
                                        {editingId
                                            ? "Update Theatre"
                                            : "Create Theatre"}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-booking-button canc"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>
                    )}


                    {loading ? (

                        <div className="page-message">
                            Loading theatres...
                        </div>

                    ) : theatres.length === 0 ? (

                        <div className="no-bookings">

                            <h2>
                                No theatres found
                            </h2>

                            <p>
                                Add your first theatre to CineBook.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-table-card">

                            <div className="admin-table-header">

                                <h2>
                                    All Theatres
                                </h2>

                                <span>
                                    {theatres.length} Theatre
                                    {theatres.length !== 1 ? "s" : ""}
                                </span>

                            </div>


                            <div className="admin-table-wrapper">

                                <table className="admin-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                Theatre
                                            </th>

                                            <th>
                                                Address
                                            </th>

                                            <th>
                                                City
                                            </th>

                                            <th>
                                                Screens
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {theatres.map((theatre) => (

                                            <tr key={theatre.id}>

                                                <td>
                                                    #{theatre.id}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {theatre.name}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {theatre.address}
                                                </td>

                                                <td>
                                                    {theatre.city}
                                                </td>

                                                <td>
                                                    {theatre.totalScreens}
                                                </td>

                                                <td>

                                                    <div className="admin-list-actions">

                                                        <button
                                                            className="show-time"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    theatre
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="cancel-booking-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    theatre.id
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

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}

export default AdminTheatres;