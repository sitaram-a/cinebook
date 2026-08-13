import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function BookingSuccess() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        booking,
        show,
        selectedSeats,
        totalAmount
    } = location.state || {};


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        const date = new Date(dateTime);

        return date.toLocaleDateString([], {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        const date = new Date(dateTime);

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    // ==========================================
    // BOOKING DATA NOT FOUND
    // ==========================================

    if (!show || !selectedSeats) {

        return (
            <>
                <Navbar />

                <main className="success-page">

                    <div className="success-card">

                        <div className="success-error-icon">
                            !
                        </div>

                        <h1>
                            Booking Information Not Found
                        </h1>

                        <p className="success-message">
                            We could not find your booking
                            information.
                        </p>

                        <button
                            className="hero-button"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </button>

                    </div>

                </main>
            </>
        );
    }


    // ==========================================
    // SEAT NAMES
    // ==========================================

    const seatNames = selectedSeats
        .map((seat) => seat.seat?.seatNumber)
        .filter(Boolean)
        .join(", ");


    // ==========================================
    // FINAL AMOUNT
    // ==========================================

    const finalAmount =
        booking?.totalAmount ??
        totalAmount ??
        0;


    return (
        <>
            <Navbar />

            <main className="success-page">

                <div className="success-card">

                    {/* ==================================
                        SUCCESS ICON
                    ================================== */}

                    <div className="success-icon">
                        ✓
                    </div>


                    {/* ==================================
                        HEADER
                    ================================== */}

                    <p className="section-label">
                        BOOKING CONFIRMED
                    </p>

                    <h1>
                        Enjoy Your Movie! 🎬
                    </h1>

                    <p className="success-message">
                        Your payment was successful and
                        your movie booking has been confirmed.
                    </p>


                    {/* ==================================
                        BOOKING REFERENCE
                    ================================== */}

                    {booking?.bookingReference && (

                        <div className="booking-reference">

                            <span>
                                Booking Reference
                            </span>

                            <strong>
                                {booking.bookingReference}
                            </strong>

                        </div>

                    )}


                    {/* ==================================
                        PAYMENT STATUS
                    ================================== */}

                    <div className="payment-status">

                        <span className="payment-status-icon">
                            ✓
                        </span>

                        <div>

                            <strong>
                                Payment Successful
                            </strong>

                            <span>
                                Your payment has been verified
                            </span>

                        </div>

                    </div>


                    {/* ==================================
                        MOVIE TICKET
                    ================================== */}

                    <div className="ticket">

                        <div className="ticket-header">

                            <div>

                                <span className="ticket-label">
                                    MOVIE
                                </span>

                                <h2>
                                    {show.movie?.title ||
                                        "Movie"}
                                </h2>

                            </div>

                            <div className="ticket-status">
                                CONFIRMED
                            </div>

                        </div>


                        {/* ==================================
                            TICKET DETAILS
                        ================================== */}

                        <div className="ticket-info">

                            {/* THEATRE */}

                            <div>

                                <span>
                                    Theatre
                                </span>

                                <strong>
                                    {show.screen?.theatre?.name ||
                                        "N/A"}
                                </strong>

                            </div>


                            {/* SCREEN */}

                            <div>

                                <span>
                                    Screen
                                </span>

                                <strong>
                                    {show.screen?.name ||
                                        "N/A"}
                                </strong>

                            </div>


                            {/* DATE */}

                            <div>

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

                            <div>

                                <span>
                                    Showtime
                                </span>

                                <strong>
                                    {formatTime(
                                        show.startTime
                                    )}
                                </strong>

                            </div>


                            {/* SEATS */}

                            <div className="ticket-seats">

                                <span>
                                    Seats
                                </span>

                                <strong>
                                    {seatNames}
                                </strong>

                            </div>


                            {/* AMOUNT */}

                            <div>

                                <span>
                                    Total Paid
                                </span>

                                <strong className="ticket-amount">
                                    ₹{finalAmount}
                                </strong>

                            </div>

                        </div>


                        {/* ==================================
                            TICKET FOOTER
                        ================================== */}

                        <div className="ticket-footer">

                            <span>
                                Please arrive at the theatre
                                before the showtime.
                            </span>

                            <span>
                                🎟️ Keep your booking reference
                                handy.
                            </span>

                        </div>

                    </div>


                    {/* ==================================
                        ACTION BUTTONS
                    ================================== */}

                    <div className="success-actions">

                        <button
                            className="hero-button"
                            onClick={() =>
                                navigate("/my-bookings")
                            }
                        >
                            View My Bookings
                        </button>


                        <button
                            className="secondary-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Back to Home
                        </button>

                    </div>

                </div>

            </main>
        </>
    );
}

export default BookingSuccess;