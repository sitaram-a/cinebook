package cinebook_backend.controller;

import cinebook_backend.entity.ShowSeat;
import cinebook_backend.service.ShowSeatService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/show-seats")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowSeatController {

    private final ShowSeatService showSeatService;

    public ShowSeatController(ShowSeatService showSeatService) {
        this.showSeatService = showSeatService;
    }

    @PostMapping("/generate/{showId}")
    public ResponseEntity<String> generateSeats(
            @PathVariable Long showId
    ) {

        showSeatService.generateSeatsForShow(showId);

        return ResponseEntity.ok(
                "Seats generated successfully"
        );
    }

    @GetMapping("/show/{showId}")
    public ResponseEntity<List<ShowSeat>> getSeats(
            @PathVariable Long showId
    ) {

        return ResponseEntity.ok(
                showSeatService.getSeatsForShow(showId)
        );
    }

    @GetMapping("/show/{showId}/available")
    public ResponseEntity<List<ShowSeat>> getAvailableSeats(
            @PathVariable Long showId
    ) {

        return ResponseEntity.ok(
                showSeatService.getAvailableSeats(showId)
        );
    }
}