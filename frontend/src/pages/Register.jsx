import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", form);

            alert("Registration successful! Please login.");

            navigate("/login");

        } catch (error) {
            console.error("Registration error:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data) {
                setError(
                    typeof error.response.data === "string"
                        ? error.response.data
                        : "Registration failed."
                );
            } else {
                setError(
                    "Unable to connect to the server. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-container">

                <div className="auth-card">

                    <p className="section-label">
                        CINEBOOK
                    </p>

                    <h1>
                        Create Account
                    </h1>

                    <p className="auth-subtitle">
                        Create your CineBook account and start booking movies.
                    </p>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label htmlFor="name">
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />

                        </div>

                        <button
                            type="submit"
                            className="confirm-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    <p className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                </div>

            </div>

        </main>
    );
}

export default Register;