import { useEffect, useRef, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import api from "./services/api";
import Navbar from "./components/Navbar";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./pages/MovieDetails";
import ShowSelection from "./pages/ShowSelection";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import Theatres from "./pages/Theatres";
import TheatreDetails from "./pages/TheatreDetails";
import Movies from "./pages/Movies";
import MovieDetailsNew from "./pages/MovieDetailsNew";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminTheatres from "./pages/admin/AdminTheatres";
import AdminScreens from "./pages/admin/AdminScreens";
import AdminSeats from "./pages/admin/AdminSeats";
import AdminShows from "./pages/admin/AdminShows";
import AdminBooking from "./pages/admin/AdminBooking";


import "./App.css";


function Home() {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const gridRef = useRef(null);

    useEffect(() => {

        api.get("/movies")
            .then((response) => {

                setMovies(response.data);

            })
            .catch((error) => {

                console.error(error);

                setError(
                    "Unable to load movies"
                );

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);


    // Scroll-reveal: cards fade + rise into place as they enter the
    // viewport, staggered by their position in the grid.
    useEffect(() => {

        if (!gridRef.current) return;

        const cards = gridRef.current.querySelectorAll(".reveal");

        if (cards.length === 0) return;

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);

                    }

                });

            },

            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }

        );

        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();

    }, [movies]);


    return (
        <>

            <Navbar />

            <main>

                {/* HERO — framed by a chasing marquee-light border */}

                <section className="hero">

                    <div className="hero-content">

                        <p className="hero-small">
                            YOUR MOVIE EXPERIENCE
                        </p>

                        <h1>
                            Book Your Movie
                            <br />
                            Experience
                        </h1>

                        <p>
                            Discover movies, find nearby
                            theatres and book your favourite
                            seats in seconds.
                        </p>

                        <button
                            className="hero-button"
                            onClick={() =>
                                document
                                    .getElementById("movies")
                                    .scrollIntoView({
                                        behavior: "smooth"
                                    })
                            }
                        >
                            Explore Movies
                        </button>

                    </div>

                    {/* bottom bulb strip — top strip is drawn via .hero::after */}
                    <div className="marquee-strip" aria-hidden="true" />

                </section>


                {/* MOVIES */}

                <section
                    className="movies-section"
                    id="movies"
                >

                    <div className="section-header">

                        <div>
                            <p className="section-label">
                                NOW SHOWING
                            </p>

                            <h2>
                                Movies
                            </h2>
                        </div>

                    </div>


                    {loading && (
                        <p className="loading">
                            Loading movies...
                        </p>
                    )}


                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}


                    {!loading &&
                        !error &&
                        movies.length === 0 && (

                            <p>
                                No movies available.
                            </p>

                        )}


                    <div className="movie-grid" ref={gridRef}>

                        {movies.map((movie, index) => (

                            <div
                                className="reveal"
                                key={movie.id}
                                style={{
                                    transitionDelay: `${(index % 8) * 70}ms`
                                }}
                            >

                                <MovieCard movie={movie} />

                            </div>

                        ))}

                    </div>

                </section>

            </main>


            {/* FOOTER */}

            <footer className="footer">

                <h3>
                    🎬 CineBook
                </h3>

                <p>
                    Your movie. Your seat. Your experience.
                </p>

                <p>
                    © 2026 CineBook
                </p>

            </footer>

        </>
    );
}


function Placeholder() {

    return (
        <>

            <Navbar />

            <div className="placeholder">

                <h1>
                    Coming Soon
                </h1>

                <p>
                    We're building this page.
                </p>

            </div>

        </>
    );
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                 path="/admin/movies"
                 element={<AdminMovies />}
              />

              <Route
                  path="/admin/theatres"
                  element={<AdminTheatres />}
              />

              <Route
                  path="/admin/screens"
                  element={<AdminScreens />}
              />

              <Route
                 path="/admin/seats"
                 element={<AdminSeats />}
              />

              <Route
                 path="/admin/shows"
                 element={<AdminShows />}
              />

               <Route
                 path="/admin/bookings"
                 element={<AdminBooking />}
              />
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                     path="/movies/:id"
                     element={<MovieDetails />}
                     />

                <Route
                     path="/movies/:id/shows"
                     element={<ShowSelection />}
                    />

                <Route
                    path="/shows/:showId/seats"
                    element={<SeatSelection />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/payment"
                    element={<Payment />}
                />

                <Route
                     path="/booking-success"
                     element={<BookingSuccess />}
                />

                <Route
                    path="/theatres"
                    element={<Theatres />}
                />

                <Route
                    path="/theatres/:theatreId"
                    element={<TheatreDetails />}
                />

               <Route
                   path="/movies"
                   element={<Movies />}
               />

               <Route
                   path="/movies/:movieId"
                   element={<MovieDetailsNew />}
               />
                <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                       <MyBookings />
                    </ProtectedRoute>
                  }
                />

                <Route
                   path="/login"
                   element={<Login />}
                />

                <Route
                path="/register"
                element={<Register />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;