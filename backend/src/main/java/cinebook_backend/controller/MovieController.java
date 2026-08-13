package cinebook_backend.controller;

import cinebook_backend.dto.MovieRequest;
import cinebook_backend.entity.Movie;
import cinebook_backend.service.MovieService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping
    public ResponseEntity<Movie> createMovie(
            @RequestBody MovieRequest request
    ) {

        Movie movie = movieService.createMovie(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(movie);
    }

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {

        return ResponseEntity.ok(
                movieService.getAllMovies()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovie(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                movieService.getMovieById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(
            @PathVariable Long id,
            @RequestBody MovieRequest request
    ) {

        return ResponseEntity.ok(
                movieService.updateMovie(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(
            @PathVariable Long id
    ) {

        movieService.deleteMovie(id);

        return ResponseEntity.noContent().build();
    }
}