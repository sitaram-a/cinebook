import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function MyBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {

        api.get("/bookings/my")
            .then((response) => {

                setBookings(response.data);

            })
            .catch((error) => {

                console.error(error);

                setError(
                    "Unable to load your bookings"
                );

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);


    const formatDate = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        const date = new Date(dateTime);

        return date.toLocaleDateString([], {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    };

    const handleCancelBooking = async (bookingId) => {

    const confirmed = window.confirm(
        "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
        return;
    }

    try {

        setCancellingId(bookingId);
        setError("");

        const response = await api.put(
            `/bookings/${bookingId}/cancel`
        );

        console.log(
            "Booking cancelled:",
            response.data
        );

        // Refresh bookings
        const bookingsResponse = await api.get("/bookings/my")

        setBookings(bookingsResponse.data);

    } catch (error) {

        console.error(
            "Cancellation error:",
            error
        );

        setError(
            error.response?.data?.message ||
            "Unable to cancel booking"
        );

    } finally {

        setCancellingId(null);

    }
};

    return (
        <>
            <Navbar />

            <main className="bookings-page">

                <div className="bookings-container">

                    <div className="bookings-header">

                        <p className="section-label">
                            YOUR ACCOUNT
                        </p>

                        <h1>
                            My Bookings
                        </h1>

                    </div>


                    {loading && (
                        <div className="page-message">
                            Loading bookings...
                        </div>
                    )}


                    {error && (
                        <div className="page-message">
                            {error}
                        </div>
                    )}


                    {!loading &&
                        !error &&
                        bookings.length === 0 && (

                            <div className="no-bookings">

                                <h2>
                                    No bookings yet
                                </h2>

                                <p>
                                    Your movie bookings
                                    will appear here.
                                </p>

                                <button
                                    className="hero-button"
                                    onClick={() =>
                                        navigate("/")
                                    }
                                >
                                    Browse Movies
                                </button>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        bookings.length > 0 && (

                            <div className="booking-list">

                                {bookings.map((booking) => (

                                    <div
                                        className="booking-card"
                                        key={booking.id}
                                    >

                                        <div className="booking-main">

                                            <div>

                                                <p className="booking-label">
                                                    MOVIE
                                                </p>

                                                <h2>
                                                    {booking.show?.movie?.title ||
                                                        "Movie"}
                                                </h2>

                                            </div>


                                            <div className="booking-reference-small">

                                                <span>
                                                    Booking Reference
                                                </span>

                                                <strong>
                                                    {booking.bookingReference}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="booking-details-grid">

                                            <div>

                                                <span>
                                                    Theatre
                                                </span>

                                                <strong>
                                                    {booking.show?.screen?.theatre?.name ||
                                                        "N/A"}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Screen
                                                </span>

                                                <strong>
                                                    {booking.show?.screen?.name ||
                                                        "N/A"}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Date
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        booking.show?.startTime
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
        (bookingSeat) =>
            bookingSeat.showSeat?.seat?.seatNumber
    )
    .filter(Boolean)
    .join(", ") ||
    "N/A"}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Amount
                                                </span>

                                                <strong>
                                                    ₹{booking.totalAmount}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Status
                                                </span>

                                                <strong
                                                    className={
                                                        booking.status ===
                                                        "CANCELLED"
                                                            ? "status-cancelled"
                                                            : "status-confirmed"
                                                    }
                                                >
                                                    {booking.status}
                                                </strong>

                                            </div>

                                        </div>

                                        {booking.status !== "CANCELLED" && (
    <div className="booking-actions">

        <button
            className="cancel-booking-button"
            onClick={() =>
                handleCancelBooking(booking.id)
            }
            disabled={
                cancellingId === booking.id
            }
        >
            {cancellingId === booking.id
                ? "Cancelling..."
                : "Cancel Booking"}
        </button>

    </div>
)}

                                    </div>

                                ))}

                            </div>

                        )}

                </div>

            </main>
        </>
    );
}

export default MyBookings;