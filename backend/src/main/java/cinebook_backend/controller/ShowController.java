package cinebook_backend.controller;

import cinebook_backend.dto.ShowRequest;
import cinebook_backend.entity.Show;
import cinebook_backend.service.ShowService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping
    public ResponseEntity<Show> createShow(
            @RequestBody ShowRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(showService.createShow(request));
    }

    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {

        return ResponseEntity.ok(
                showService.getAllShows()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShow(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                showService.getShowById(id)
        );
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Show>> getShowsByMovie(
            @PathVariable Long movieId
    ) {

        return ResponseEntity.ok(
                showService.getShowsByMovie(movieId)
        );
    }

    @GetMapping("/movie/{movieId}/active")
    public ResponseEntity<List<Show>> getActiveShowsByMovie(
            @PathVariable Long movieId
    ) {

        return ResponseEntity.ok(
                showService.getActiveShowsByMovie(movieId)
        );
    }

    @GetMapping("/screen/{screenId}")
    public ResponseEntity<List<Show>> getShowsByScreen(
            @PathVariable Long screenId
    ) {

        return ResponseEntity.ok(
                showService.getShowsByScreen(screenId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Show> updateShow(
            @PathVariable Long id,
            @RequestBody ShowRequest request
    ) {

        return ResponseEntity.ok(
                showService.updateShow(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShow(
            @PathVariable Long id
    ) {

        showService.deleteShow(id);

        return ResponseEntity.noContent().build();
    }
}