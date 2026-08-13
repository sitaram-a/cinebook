import { Link } from "react-router-dom";

function MovieCard({ movie }) {

    return (
        <div className="movie-card">

            <div className="movie-poster">

                {movie.posterUrl ? (
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                    />
                ) : (
                    <div className="poster-placeholder">
                        🎬
                    </div>
                )}

            </div>

            <div className="movie-info">

                <h3>{movie.title}</h3>

                <div className="movie-meta">
                    <span>⭐ {movie.rating}</span>
                    <span>{movie.language}</span>
                </div>

                <p>{movie.genre}</p>

                <Link
                    to={`/movies/${movie.id}`}
                    className="book-button"
                >
                    Book Now
                </Link>

            </div>

        </div>
    );
}

export default MovieCard;