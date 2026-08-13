package cinebook_backend.controller;

import cinebook_backend.dto.ScreenRequest;
import cinebook_backend.entity.Screen;
import cinebook_backend.service.ScreenService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screens")
@CrossOrigin(origins = "http://localhost:5173")
public class ScreenController {

    private final ScreenService screenService;

    public ScreenController(ScreenService screenService) {
        this.screenService = screenService;
    }

    @PostMapping
    public ResponseEntity<Screen> createScreen(
            @RequestBody ScreenRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(screenService.createScreen(request));
    }

    @GetMapping
    public ResponseEntity<List<Screen>> getAllScreens() {

        return ResponseEntity.ok(
                screenService.getAllScreens()
        );
    }

    @GetMapping("/theatre/{theatreId}")
    public ResponseEntity<List<Screen>> getScreensByTheatre(
            @PathVariable Long theatreId
    ) {

        return ResponseEntity.ok(
                screenService.getScreensByTheatre(theatreId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Screen> getScreen(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                screenService.getScreenById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Screen> updateScreen(
            @PathVariable Long id,
            @RequestBody ScreenRequest request
    ) {

        return ResponseEntity.ok(
                screenService.updateScreen(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreen(
            @PathVariable Long id
    ) {

        screenService.deleteScreen(id);

        return ResponseEntity.noContent().build();
    }
}