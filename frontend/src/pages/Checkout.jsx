import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Checkout() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        showId,
        selectedSeats,
        totalAmount
    } = location.state || {};

    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD SHOW
    // =========================================================

    useEffect(() => {

        if (!showId) {

            navigate("/");
            return;
        }

        api.get(`/shows/${showId}`)

            .then((response) => {

                setShow(response.data);

            })

            .catch((error) => {

                console.error(
                    "Unable to load show:",
                    error
                );

                setError(
                    "Unable to load show details"
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, [showId, navigate]);


    // =========================================================
    // FORMAT TIME
    // =========================================================

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


    // =========================================================
    // FORMAT DATE
    // =========================================================

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


    // =========================================================
    // LOAD RAZORPAY SCRIPT
    // =========================================================

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            const existingScript =
                document.querySelector(
                    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                );

            if (existingScript) {

                resolve(true);
                return;
            }


            const script =
                document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {

                resolve(true);

            };

            script.onerror = () => {

                resolve(false);

            };

            document.body.appendChild(script);

        });
    };


    // =========================================================
    // HANDLE PAYMENT
    // =========================================================

    const handlePayment = async () => {

        // -----------------------------------------------------
        // Validate seats
        // -----------------------------------------------------

        if (
            !selectedSeats ||
            selectedSeats.length === 0
        ) {

            alert("No seats selected");

            return;
        }


        // -----------------------------------------------------
        // Validate amount
        // -----------------------------------------------------

        if (
            !totalAmount ||
            Number(totalAmount) <= 0
        ) {

            setError(
                "Invalid payment amount"
            );

            return;
        }


        try {

            setBooking(true);
            setError("");


            // =================================================
            // LOAD RAZORPAY
            // =================================================

            const razorpayLoaded =
                await loadRazorpayScript();


            if (!razorpayLoaded) {

                setError(
                    "Unable to load Razorpay. Please check your internet connection."
                );

                setBooking(false);

                return;
            }


            // =================================================
            // CREATE RAZORPAY ORDER
            // =================================================

            const orderResponse =
                await api.post(
                    "/payments/create-order",
                    {
                        amount: Number(totalAmount)
                    }
                );


            console.log(
                "Razorpay order:",
                orderResponse.data
            );


            const {
                orderId,
                amount,
                currency,
                keyId
            } = orderResponse.data;


            if (!orderId) {

                throw new Error(
                    "Razorpay order ID was not returned"
                );
            }


            // =================================================
            // RAZORPAY OPTIONS
            // =================================================

            const options = {

                key: keyId,

                amount: amount,

                currency: currency,

                name: "CineBook",

                description:
                    `${show?.movie?.title || "Movie"} - Movie Tickets`,

                order_id: orderId,


                // =================================================
                // PAYMENT SUCCESS
                // =================================================

                handler: async function (response) {

                    console.log(
                        "Razorpay payment successful:",
                        response
                    );


                    try {

                        setBooking(true);
                        setError("");


                        // =========================================
                        // PAYMENT VERIFICATION REQUEST
                        // =========================================

                        const verificationRequest = {

                            razorpayOrderId:
                                response.razorpay_order_id,

                            razorpayPaymentId:
                                response.razorpay_payment_id,

                            razorpaySignature:
                                response.razorpay_signature,

                            showId:
                                Number(showId),

                            showSeatIds:
                                selectedSeats.map(
                                    (seat) => seat.id
                                )
                        };


                        console.log(
                            "Sending payment verification:",
                            verificationRequest
                        );


                        // =========================================
                        // VERIFY PAYMENT
                        // =========================================

                        const verifyResponse =
                            await api.post(
                                "/payments/verify",
                                verificationRequest
                            );


                        console.log(
                            "Payment verification response:",
                            verifyResponse.data
                        );


                        // =========================================
                        // PAYMENT + BOOKING SUCCESS
                        // =========================================

                        const createdBooking =
                            verifyResponse.data;


                        // Go to booking success page
                        navigate(
                            "/booking-success",
                            {
                                state: {
                                    booking: createdBooking,
                                    show: show,
                                    selectedSeats:
                                        selectedSeats,
                                    totalAmount:
                                        totalAmount
                                }
                            }
                        );


                    } catch (error) {

                        console.error(
                            "Payment verification failed:",
                            error
                        );


                        if (error.response) {

                            setError(
                                error.response.data?.message ||
                                error.response.data ||
                                "Payment verification failed"
                            );

                        } else {

                            setError(
                                "Unable to verify payment with server"
                            );
                        }

                    } finally {

                        setBooking(false);

                    }
                },


                // =================================================
                // PREFILL
                // =================================================

                prefill: {

                    name: "",

                    email: "",

                    contact: ""
                },


                // =================================================
                // THEME
                // =================================================

                theme: {

                    color: "#e50914"
                },


                // =================================================
                // MODAL
                // =================================================

                modal: {

                    confirm_close: true,

                    escape: true,

                    backdropclose: false
                }
            };


            // =================================================
            // CREATE RAZORPAY INSTANCE
            // =================================================

            const razorpay =
                new window.Razorpay(options);


            // =================================================
            // PAYMENT FAILED
            // =================================================

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "Razorpay payment failed:",
                        response
                    );


                    setError(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    );


                    setBooking(false);
                }
            );


            // =================================================
            // OPEN RAZORPAY
            // =================================================

            razorpay.open();

            setBooking(false);


        } catch (error) {

            console.error(
                "Payment error:",
                error
            );


            if (error.response) {

                setError(
                    error.response.data?.message ||
                    error.response.data ||
                    "Unable to create payment order"
                );

            } else {

                setError(
                    error.message ||
                    "Unable to start payment"
                );
            }


            setBooking(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    Loading checkout...
                </div>
            </>
        );
    }


    // =========================================================
    // ERROR WITHOUT SHOW
    // =========================================================

    if (error && !show) {

        return (
            <>
                <Navbar />

                <div className="page-message">
                    {error}
                </div>
            </>
        );
    }


    if (!show) {
        return null;
    }


    // =========================================================
    // CHECKOUT UI
    // =========================================================

    return (
        <>
            <Navbar />

            <main className="checkout-page">

                <div className="checkout-container">


                    {/* =========================================
                        HEADER
                    ========================================= */}

                    <div className="checkout-header">

                        <p className="section-label">
                            CHECKOUT
                        </p>

                        <h1>
                            Review Your Booking
                        </h1>

                    </div>


                    <div className="checkout-grid">


                        {/* =====================================
                            BOOKING DETAILS
                        ===================================== */}

                        <div className="booking-details">


                            {/* MOVIE / SHOW DETAILS */}

                            <div className="checkout-card">

                                <h2>
                                    {show.movie?.title ||
                                        "Movie"}
                                </h2>


                                <div className="booking-info">


                                    <div>

                                        <span>
                                            Theatre
                                        </span>

                                        <strong>
                                            {show.screen?.theatre?.name ||
                                                "Theatre"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Screen
                                        </span>

                                        <strong>
                                            {show.screen?.name ||
                                                "Screen"}
                                        </strong>

                                    </div>


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

                                </div>

                            </div>


                            {/* SELECTED SEATS */}

                            <div className="checkout-card">

                                <h2>
                                    Selected Seats
                                </h2>


                                <div className="selected-seat-list">

                                    {selectedSeats?.map(
                                        (seat) => (

                                            <span
                                                key={seat.id}
                                            >
                                                {seat.seat?.seatNumber ||
                                                    "Seat"}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            PRICE SUMMARY
                        ===================================== */}

                        <div className="checkout-card price-card">

                            <h2>
                                Price Summary
                            </h2>


                            <div className="price-row">

                                <span>
                                    Tickets
                                </span>

                                <span>
                                    {selectedSeats?.length || 0}
                                </span>

                            </div>


                            <div className="price-row">

                                <span>
                                    Ticket Price
                                </span>

                                <span>
                                    ₹{totalAmount}
                                </span>

                            </div>


                            <div className="price-row">

                                <span>
                                    Convenience Fee
                                </span>

                                <span>
                                    ₹0
                                </span>

                            </div>


                            <div className="price-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{totalAmount}
                                </strong>

                            </div>


                            {/* ERROR */}

                            {error && (

                                <p className="checkout-error">
                                    {error}
                                </p>

                            )}


                            {/* =================================
                                PAYMENT BUTTON
                            ================================= */}

                            <button
                                className="confirm-button"
                                onClick={handlePayment}
                                disabled={booking}
                            >

                                {booking
                                    ? "Processing..."
                                    : `Pay ₹${totalAmount}`}

                            </button>


                            <p className="secure-text">
                                🔒 Secure payment powered by Razorpay
                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </>
    );
}

export default Checkout;