package cinebook_backend.controller;

import cinebook_backend.dto.TheatreRequest;
import cinebook_backend.entity.Theatre;
import cinebook_backend.service.TheatreService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@CrossOrigin(origins = "http://localhost:5173")
public class TheatreController {

    private final TheatreService theatreService;

    public TheatreController(TheatreService theatreService) {
        this.theatreService = theatreService;
    }

    @PostMapping
    public ResponseEntity<Theatre> createTheatre(
            @RequestBody TheatreRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(theatreService.createTheatre(request));
    }

    @GetMapping
    public ResponseEntity<List<Theatre>> getAllTheatres() {

        return ResponseEntity.ok(
                theatreService.getAllTheatres()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theatre> getTheatre(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                theatreService.getTheatreById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Theatre> updateTheatre(
            @PathVariable Long id,
            @RequestBody TheatreRequest request
    ) {

        return ResponseEntity.ok(
                theatreService.updateTheatre(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheatre(
            @PathVariable Long id
    ) {

        theatreService.deleteTheatre(id);

        return ResponseEntity.noContent().build();
    }
}