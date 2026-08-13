import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");


    // =========================
    // LOAD BOOKINGS
    // =========================

    const loadBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/bookings/admin/all"
            );

            // Newest first
            const sorted = [...response.data].sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

            setBookings(sorted);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load bookings"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadBookings();

    }, []);


    // =========================
    // CANCEL BOOKING
    // =========================

    const handleCancelBooking = async (bookingId) => {

        const confirmed = window.confirm(
            "Cancel this booking? This will release the seats back to available."
        );

        if (!confirmed) {
            return;
        }

        try {

            setCancellingId(bookingId);
            setError("");
            setSuccess("");

            await api.put(
                `/bookings/${bookingId}/admin-cancel`
            );

            setSuccess(
                "Booking cancelled successfully."
            );

            await loadBookings();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to cancel booking"
            );

        } finally {

            setCancellingId(null);

        }
    };


    // =========================
    // FORMAT HELPERS
    // =========================

    const formatDateTime = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString([], {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const seatLabel = (bookingSeat) => {

        const seat = bookingSeat.showSeat?.seat;

        if (!seat) {
            return "N/A";
        }

        return `${seat.rowName}${seat.seatNumber}`;
    };


    // =========================
    // FILTERED LIST
    // =========================

    const filteredBookings =
        statusFilter === "ALL"
            ? bookings
            : bookings.filter(
                  (booking) =>
                      booking.status === statusFilter
              );

    const statusCounts = {
        ALL: bookings.length,
        CONFIRMED: bookings.filter(
            (b) => b.status === "CONFIRMED"
        ).length,
        PENDING: bookings.filter(
            (b) => b.status === "PENDING"
        ).length,
        CANCELLED: bookings.filter(
            (b) => b.status === "CANCELLED"
        ).length
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
                                Manage Bookings
                            </h1>

                            <p>
                                View and manage customer
                                bookings across all theatres.
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


                    {/* STATUS FILTER TABS */}

                    <div className="booking-filter-tabs">

                        {[
                            ["ALL", "All"],
                            ["CONFIRMED", "Confirmed"],
                            ["PENDING", "Pending"],
                            ["CANCELLED", "Cancelled"]
                        ].map(([value, label]) => (

                            <button
                                key={value}
                                className={
                                    statusFilter === value
                                        ? "filter-tab active"
                                        : "filter-tab"
                                }
                                onClick={() =>
                                    setStatusFilter(value)
                                }
                            >

                                {label}

                                <span className="filter-tab-count">
                                    {statusCounts[value] ?? 0}
                                </span>

                            </button>

                        ))}

                    </div>


                    {/* BOOKING LIST */}

                    <div className="admin-list-section">

                        <div className="admin-list-header">

                            <div>

                                <p className="section-label">
                                    BOOKING LEDGER
                                </p>

                                <h2>
                                    All Bookings
                                </h2>

                            </div>

                            <strong>
                                {filteredBookings.length} Bookings
                            </strong>

                        </div>


                        {loading && (

                            <div className="page-message">
                                Loading bookings...
                            </div>

                        )}


                        {!loading &&
                            filteredBookings.length === 0 && (

                                <div className="no-bookings">

                                    <h2>
                                        No bookings found
                                    </h2>

                                    <p>
                                        {statusFilter === "ALL"
                                            ? "No customer has booked a show yet."
                                            : `No ${statusFilter.toLowerCase()} bookings right now.`}
                                    </p>

                                </div>

                            )}


                        {!loading &&
                            filteredBookings.length > 0 && (

                                <div className="booking-list">

                                    {filteredBookings.map(
                                        (booking) => (

                                            <div
                                                className="booking-card"
                                                key={booking.id}
                                            >

                                                <div className="booking-main">

                                                    <div>

                                                        <p className="booking-label">
                                                            {booking.show
                                                                ?.movie
                                                                ?.title
                                                                ? "MOVIE"
                                                                : "BOOKING"}
                                                        </p>

                                                        <h2>
                                                            {booking.show
                                                                ?.movie
                                                                ?.title ||
                                                                "Unknown Movie"}
                                                        </h2>

                                                    </div>


                                                    <div className="booking-reference-small">

                                                        <span>
                                                            Reference
                                                        </span>

                                                        <strong>
                                                            {
                                                                booking.bookingReference
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* CUSTOMER */}

                                                <div className="admin-booking-customer">

                                                    <span>
                                                        Booked by
                                                    </span>

                                                    <strong>
                                                        {booking.user
                                                            ?.name ||
                                                            "N/A"}
                                                        {" "}
                                                        &middot;{" "}
                                                        {booking.user
                                                            ?.email ||
                                                            "N/A"}
                                                    </strong>

                                                </div>


                                                <div className="booking-details-grid">

                                                    <div>

                                                        <span>
                                                            Theatre
                                                        </span>

                                                        <strong>
                                                            {booking.show
                                                                ?.screen
                                                                ?.theatre
                                                                ?.name ||
                                                                "N/A"}
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Showtime
                                                        </span>

                                                        <strong>
                                                            {formatDateTime(
                                                                booking
                                                                    .show
                                                                    ?.startTime
                                                            )}
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Seats
                                                        </span>

                                                        <strong>
                                                            {booking.bookingSeats
                                                                ?.map(
                                                                    seatLabel
                                                                )
                                                                .join(
                                                                    ", "
                                                                ) ||
                                                                "N/A"}
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Amount
                                                        </span>

                                                        <strong>
                                                            ₹
                                                            {
                                                                booking.totalAmount
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Booked On
                                                        </span>

                                                        <strong>
                                                            {formatDateTime(
                                                                booking.createdAt
                                                            )}
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Status
                                                        </span>

                                                        <strong
                                                            className={
                                                                booking.status ===
                                                                "CONFIRMED"
                                                                    ? "status-confirmed"
                                                                    : booking.status ===
                                                                      "CANCELLED"
                                                                    ? "status-cancelled"
                                                                    : "status-pending"
                                                            }
                                                        >
                                                            {
                                                                booking.status
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>


                                                {booking.status !==
                                                    "CANCELLED" && (

                                                    <div className="booking-actions">

                                                        <button
                                                            className="cancel-booking-button"
                                                            onClick={() =>
                                                                handleCancelBooking(
                                                                    booking.id
                                                                )
                                                            }
                                                            disabled={
                                                                cancellingId ===
                                                                booking.id
                                                            }
                                                        >
                                                            {cancellingId ===
                                                            booking.id
                                                                ? "Cancelling..."
                                                                : "Cancel Booking"}
                                                        </button>

                                                    </div>

                                                )}

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                    </div>

                </div>

            </main>
        </>
    );
}

export default AdminBookings;