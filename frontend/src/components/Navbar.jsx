import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* LOGO */}

                <Link to="/" className="logo">
                    🎬 CineBook
                </Link>


                <div className="nav-links">

                    {/* HOME */}

                    <Link
                        to="/"
                        className={
                            isActive("/")
                                ? "active"
                                : ""
                        }
                    >
                        Home
                    </Link>


                    {/* MOVIES */}

                    <Link
                        to="/movies"
                        className={
                            isActive("/movies")
                                ? "active"
                                : ""
                        }
                    >
                        Movies
                    </Link>


                    {/* THEATRES */}

                    <Link
                        to="/theatres"
                        className={
                            isActive("/theatres")
                                ? "active"
                                : ""
                        }
                    >
                        Theatres
                    </Link>


                    {/* MY BOOKINGS */}

                    {token && (

                        <Link
                            to="/my-bookings"
                            className={
                                isActive("/my-bookings")
                                    ? "active"
                                    : ""
                            }
                        >
                            My Bookings
                        </Link>

                    )}


                    {/* LOGIN / LOGOUT */}

                    {!token ? (

                        <Link
                            to="/login"
                            className="login-link"
                        >
                            Login
                        </Link>

                    ) : (

                        <button
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>

                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;