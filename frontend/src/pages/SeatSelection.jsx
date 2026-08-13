import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function SeatSelection() {

    const { showId } = useParams();
    const navigate = useNavigate();

    const [showSeats, setShowSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [show, setShow] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");


    // ==========================================
    // SORT SEATS
    // ==========================================

    const sortSeats = (seats) => {

        return [...seats].sort((a, b) => {

            const rowA = a.seat?.rowName || "";
            const rowB = b.seat?.rowName || "";

            // First sort by row
            if (rowA !== rowB) {
                return rowA.localeCompare(rowB);
            }

            // Then sort by seat number
            const numberA = parseInt(
                (a.seat?.seatNumber || "").replace(/\D/g, ""),
                10
            );

            const numberB = parseInt(
                (b.seat?.seatNumber || "").replace(/\D/g, ""),
                10
            );

            return numberA - numberB;

        });
    };


    // ==========================================
    // UPDATE SEATS
    // ==========================================

    const updateSeats = (seats) => {

        const sortedSeats = sortSeats(seats);

        setShowSeats(sortedSeats);

        // Remove seats from current selection
        // if they are no longer available
        setSelectedSeats((currentSelected) =>
            currentSelected.filter((selectedSeat) => {

                const updatedSeat = sortedSeats.find(
                    (seat) =>
                        seat.id === selectedSeat.id
                );

                return (
                    updatedSeat &&
                    updatedSeat.status === "AVAILABLE"
                );

            })
        );
    };


    // ==========================================
    // LOAD SHOW + SEATS
    // ==========================================

    const loadSeats = async (isRefresh = false) => {

        try {

            if (isRefresh) {

                setRefreshing(true);

            } else {

                setLoading(true);

            }

            setError("");

            const [
                showResponse,
                seatsResponse
            ] = await Promise.all([

                api.get(`/shows/${showId}`),

                api.get(
                    `/show-seats/show/${showId}`
                )

            ]);


            setShow(showResponse.data);

            updateSeats(
                seatsResponse.data
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load seat availability"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadSeats();

    }, [showId]);


    // ==========================================
    // AUTO REFRESH
    // ==========================================

    useEffect(() => {

        let isMounted = true;


        const refreshSeats = async () => {

            try {

                const response = await api.get(
                    `/show-seats/show/${showId}`
                );


                if (!isMounted) {
                    return;
                }


                const sortedSeats = sortSeats(
                    response.data
                );


                setShowSeats(
                    sortedSeats
                );


                // Remove selected seats that are
                // no longer available
                setSelectedSeats(
                    (currentSelected) =>
                        currentSelected.filter(
                            (selectedSeat) => {

                                const latestSeat =
                                    sortedSeats.find(
                                        (seat) =>
                                            seat.id ===
                                            selectedSeat.id
                                    );

                                return (
                                    latestSeat &&
                                    latestSeat.status ===
                                        "AVAILABLE"
                                );

                            }
                        )
                );


                setError("");

            } catch (error) {

                console.error(
                    "Unable to refresh seats:",
                    error
                );


                if (isMounted) {

                    setError(
                        "Unable to load seats"
                    );

                }

            }

        };


        // Refresh every 5 seconds
        const interval = setInterval(
            refreshSeats,
            5000
        );


        return () => {

            isMounted = false;

            clearInterval(interval);

        };

    }, [showId]);


    // ==========================================
    // TOGGLE SEAT
    // ==========================================

    const toggleSeat = (seat) => {

        // Booked seats cannot be selected
        if (seat.status !== "AVAILABLE") {
            return;
        }


        setSelectedSeats((current) => {

            const alreadySelected =
                current.some(
                    (item) =>
                        item.id === seat.id
                );


            // Remove seat
            if (alreadySelected) {

                return current.filter(
                    (item) =>
                        item.id !== seat.id
                );

            }


            // Add seat
            return [
                ...current,
                seat
            ];

        });

    };


    // ==========================================
    // TOTAL AMOUNT
    // ==========================================

    const totalAmount =
        selectedSeats.reduce(
            (total, seat) =>
                total +
                Number(
                    seat.seat?.price || 0
                ),
            0
        );


    // ==========================================
    // AVAILABLE / BOOKED COUNTS
    // ==========================================

    const availableSeats =
        showSeats.filter(
            (seat) =>
                seat.status === "AVAILABLE"
        ).length;


    const bookedSeats =
        showSeats.filter(
            (seat) =>
                seat.status === "BOOKED"
        ).length;


    // ==========================================
    // CONTINUE TO CHECKOUT
    // ==========================================

    const handleContinue = () => {

        if (selectedSeats.length === 0) {

            alert(
                "Please select at least one seat"
            );

            return;

        }


        navigate(
            "/checkout",
            {
                state: {

                    showId: Number(showId),

                    selectedSeats,

                    totalAmount

                }
            }
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

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


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <>
                <Navbar />

                <div className="page-message">

                    <p>
                        {error}
                    </p>


                    <button
                        className="hero-button"
                        onClick={() =>
                            loadSeats()
                        }
                    >
                        Try Again
                    </button>

                </div>
            </>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <>
            <Navbar />

            <main className="seat-page">

                <div className="seat-container">


                    {/* ==================================
                        HEADER
                    ================================== */}

                    <div className="seat-header">

                        <p className="section-label">
                            SELECT YOUR SEATS
                        </p>


                        <h1>
                            {show?.movie?.title ||
                                "Choose Your Seats"}
                        </h1>


                        {show && (

                            <p>

                                {show.screen?.theatre?.name}

                                {" • "}

                                {show.screen?.name}

                            </p>

                        )}

                    </div>


                    {/* ==================================
                        LIVE AVAILABILITY
                    ================================== */}

                    <div className="seat-availability" style={{display:"flex",justifyContent:"space-evenly"}}>

                        <div>

                            <span style={{ fontFamily:"var(--font-mono)",
fontSize:"18px",
    color:"var(--gold)",
    whiteSpac:"nowrap",
    marginRight:"10px"
}}>
                                Available
                            </span>

                            <strong>
                                {availableSeats}
                            </strong>

                        </div>


                        <div>

                            <span style={{ fontFamily:"var(--font-mono)",
fontSize:"18px",
    color:"var(--gold)",
    whiteSpac:"nowrap",
    marginRight:"10px"
}}>
                                Booked
                            </span>

                            <strong>
                                {bookedSeats}
                            </strong>

                        </div>


                        <button
                            className="cancel-booking-button"
                            onClick={() =>
                                loadSeats(true)
                            }
                            disabled={refreshing}
                        >

                            {refreshing
                                ? "Refreshing..."
                                : "↻ Refresh"}

                        </button>

                    </div>


                    {/* ==================================
                        REFRESH MESSAGE
                    ================================== */}

                    {refreshing && (

                        <p className="seat-refresh-message">

                            Checking latest seat
                            availability...

                        </p>

                    )}


                    {/* ==================================
                        SCREEN
                    ================================== */}

                    <div className="cinema-screen">

                        <div className="screen-line">
                        </div>


                        <p>
                            SCREEN
                        </p>

                    </div>


                    {/* ==================================
                        SEATS
                    ================================== */}

                    <div className="seat-layout">

                        {showSeats.map(
                            (showSeat) => {

                                const isSelected =
                                    selectedSeats.some(
                                        (seat) =>
                                            seat.id ===
                                            showSeat.id
                                    );


                                let seatClass =
                                    "seat available";


                                if (
                                    showSeat.status ===
                                    "BOOKED"
                                ) {

                                    seatClass =
                                        "seat booked";

                                } else if (
                                    isSelected
                                ) {

                                    seatClass =
                                        "seat selected";

                                }


                                return (

                                    <button
                                        key={
                                            showSeat.id
                                        }
                                        className={
                                            seatClass
                                        }
                                        onClick={() =>
                                            toggleSeat(
                                                showSeat
                                            )
                                        }
                                        disabled={
                                            showSeat.status !==
                                            "AVAILABLE"
                                        }
                                        title={

                                            showSeat.status ===
                                            "BOOKED"

                                                ? "Seat already booked"

                                                : isSelected

                                                    ? "Selected"

                                                    : "Available"

                                        }
                                    >

                                        {
                                            showSeat
                                                .seat
                                                ?.seatNumber
                                        }

                                    </button>

                                );

                            }
                        )}

                    </div>


                    {/* ==================================
                        LEGEND
                    ================================== */}

                    <div className="seat-legend">


                        <div>

                            <span className="legend-seat available">
                            </span>

                            Available

                        </div>


                        <div>

                            <span className="legend-seat selected">
                            </span>

                            Selected

                        </div>


                        <div>

                            <span className="legend-seat booked">
                            </span>

                            Booked

                        </div>

                    </div>


                    {/* ==================================
                        SUMMARY
                    ================================== */}

                    <div className="seat-summary">


                        <div>

                            <p>
                                Selected Seats
                            </p>


                            <strong>

                                {selectedSeats.length > 0

                                    ? selectedSeats
                                        .map(
                                            (seat) =>
                                                seat
                                                    .seat
                                                    ?.seatNumber
                                        )
                                        .join(", ")

                                    : "None"}

                            </strong>

                        </div>


                        <div>

                            <p>
                                Total
                            </p>


                            <strong>
                                ₹{totalAmount}
                            </strong>

                        </div>


                        <button
                            className="continue-button"
                            onClick={
                                handleContinue
                            }
                            disabled={
                                selectedSeats.length ===
                                0
                            }
                        >

                            Continue

                        </button>

                    </div>

                </div>

            </main>
        </>
    );
}

export default SeatSelection;