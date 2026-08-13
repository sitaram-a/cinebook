import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        showId,
        selectedSeats,
        totalAmount,
        show
    } = location.state || {};

    const [paymentMethod, setPaymentMethod] =
        useState("UPI");

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // PROTECT PAYMENT PAGE
    // ==========================================

    if (!showId || !selectedSeats?.length) {

        navigate("/");

        return null;
    }


    // ==========================================
    // COMPLETE PAYMENT
    // ==========================================

    const handlePayment = async () => {

        try {

            setProcessing(true);
            setError("");


            // --------------------------------------
            // MOCK PAYMENT PROCESS
            // --------------------------------------

            await new Promise(resolve =>
                setTimeout(resolve, 1500)
            );


            // --------------------------------------
            // CREATE BOOKING
            // --------------------------------------

            const bookingRequest = {

                showId: Number(showId),

                showSeatIds:
                    selectedSeats.map(
                        seat => seat.id
                    )

            };


            const response = await api.post(
                "/bookings",
                bookingRequest
            );


            console.log(
                "Booking created:",
                response.data
            );


            // --------------------------------------
            // GO TO SUCCESS PAGE
            // --------------------------------------

            navigate(
                "/booking-success",
                {
                    state: {

                        booking: response.data,

                        show,

                        selectedSeats,

                        totalAmount,

                        paymentMethod

                    }
                }
            );


        } catch (error) {

            console.error(
                "Payment/booking error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Payment failed. Please try again."
            );


        } finally {

            setProcessing(false);

        }
    };


    return (
        <>
            <Navbar />

            <main className="payment-page">

                <div className="payment-container">


                    {/* HEADER */}

                    <div className="payment-header">

                        <p className="section-label">
                            PAYMENT
                        </p>

                        <h1>
                            Complete Your Payment
                        </h1>

                        <p>
                            Choose a payment method
                            to confirm your booking.
                        </p>

                    </div>


                    <div className="payment-grid">


                        {/* PAYMENT METHODS */}

                        <div className="payment-card">

                            <h2>
                                Payment Method
                            </h2>


                            {/* UPI */}

                            <button
                                className={
                                    paymentMethod === "UPI"
                                        ? "payment-method active"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod("UPI")
                                }
                                disabled={processing}
                            >

                                <span className="payment-icon">
                                    📱
                                </span>

                                <span>

                                    <strong>
                                        UPI
                                    </strong>

                                    <small>
                                        Google Pay, PhonePe,
                                        Paytm
                                    </small>

                                </span>

                            </button>


                            {/* CARD */}

                            <button
                                className={
                                    paymentMethod === "CARD"
                                        ? "payment-method active"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod("CARD")
                                }
                                disabled={processing}
                            >

                                <span className="payment-icon">
                                    💳
                                </span>

                                <span>

                                    <strong>
                                        Credit / Debit Card
                                    </strong>

                                    <small>
                                        Visa, Mastercard,
                                        RuPay
                                    </small>

                                </span>

                            </button>


                            {/* NET BANKING */}

                            <button
                                className={
                                    paymentMethod === "NETBANKING"
                                        ? "payment-method active"
                                        : "payment-method"
                                }
                                onClick={() =>
                                    setPaymentMethod(
                                        "NETBANKING"
                                    )
                                }
                                disabled={processing}
                            >

                                <span className="payment-icon">
                                    🏦
                                </span>

                                <span>

                                    <strong>
                                        Net Banking
                                    </strong>

                                    <small>
                                        All major banks
                                    </small>

                                </span>

                            </button>


                            {/* ERROR */}

                            {error && (

                                <div className="payment-error">
                                    {error}
                                </div>

                            )}

                        </div>


                        {/* ORDER SUMMARY */}

                        <div className="payment-card payment-summary">

                            <p className="section-label">
                                ORDER SUMMARY
                            </p>


                            <h2>
                                {show?.movie?.title}
                            </h2>


                            <div className="payment-summary-info">

                                <div>

                                    <span>
                                        Theatre
                                    </span>

                                    <strong>
                                        {show?.screen?.theatre?.name}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Screen
                                    </span>

                                    <strong>
                                        {show?.screen?.name}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Seats
                                    </span>

                                    <strong>
                                        {selectedSeats
                                            .map(
                                                seat =>
                                                    seat.seat
                                                        ?.seatNumber
                                            )
                                            .join(", ")}
                                    </strong>

                                </div>

                            </div>


                            <div className="payment-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹{totalAmount}
                                </strong>

                            </div>


                            <button
                                className="confirm-button"
                                onClick={handlePayment}
                                disabled={processing}
                            >

                                {processing
                                    ? "Processing Payment..."
                                    : `Pay ₹${totalAmount}`
                                }

                            </button>


                            <p className="secure-text">
                                🔒 Your payment is secure
                            </p>

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
}

export default Payment;