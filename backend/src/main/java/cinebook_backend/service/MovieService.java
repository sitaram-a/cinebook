package cinebook_backend.service;

import cinebook_backend.dto.MovieRequest;
import cinebook_backend.entity.Movie;
import cinebook_backend.repository.MovieRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie createMovie(MovieRequest request) {

        Movie movie = Movie.builder()
                .title(request.title())
                .description(request.description())
                .genre(request.genre())
                .language(request.language())
                .duration(request.duration())
                .releaseDate(request.releaseDate())
                .posterUrl(request.posterUrl())
                .trailerUrl(request.trailerUrl())
                .rating(request.rating())
                .build();

        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {

        return movieRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Movie not found")
                );
    }

    public Movie updateMovie(Long id, MovieRequest request) {

        Movie movie = getMovieById(id);

        movie.setTitle(request.title());
        movie.setDescription(request.description());
        movie.setGenre(request.genre());
        movie.setLanguage(request.language());
        movie.setDuration(request.duration());
        movie.setReleaseDate(request.releaseDate());
        movie.setPosterUrl(request.posterUrl());
        movie.setTrailerUrl(request.trailerUrl());
        movie.setRating(request.rating());

        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {

        Movie movie = getMovieById(id);

        movieRepository.delete(movie);
    }
}