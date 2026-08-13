import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            const token = response.data.token;

            // Save JWT token
            localStorage.setItem("token", token);

            console.log("Login successful");

            // Go to homepage
            navigate("/");

        } catch (error) {

            console.error("Login error:", error);

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Invalid email or password"
                );

            } else {

                setError(
                    "Unable to connect to the server"
                );

            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <Navbar />

            <main className="auth-page">

                <div className="auth-card">

                    <div className="auth-header">

                        <p className="section-label">
                            CINEBOOK
                        </p>

                        <h1>
                            Login
                        </h1>

                        <p>
                            Login to continue booking your
                            favourite movies.
                        </p>

                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                            />

                        </div>

                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="confirm-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                </div>

            </main>
        </>
    );
}

export default Login;