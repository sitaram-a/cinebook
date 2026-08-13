package cinebook_backend.controller;

import cinebook_backend.dto.BulkPriceUpdateRequest;
import cinebook_backend.dto.GenerateSeatsRequest;
import cinebook_backend.dto.SeatRequest;
import cinebook_backend.entity.Seat;
import cinebook_backend.service.SeatService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:5173")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @PostMapping
    public ResponseEntity<Seat> createSeat(
            @RequestBody SeatRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(seatService.createSeat(request));
    }

    @PostMapping("/generate")
    public ResponseEntity<List<Seat>> generateSeats(
            @RequestBody GenerateSeatsRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(seatService.generateSeats(request));
    }

    @PostMapping("/add-batch")
    public ResponseEntity<List<Seat>> addSeats(
            @RequestBody GenerateSeatsRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(seatService.addSeats(request));
    }

    @PutMapping("/screen/{screenId}/bulk-price")
    public ResponseEntity<List<Seat>> bulkUpdatePrice(
            @PathVariable Long screenId,
            @RequestBody BulkPriceUpdateRequest request
    ) {

        return ResponseEntity.ok(
                seatService.bulkUpdatePrice(
                        screenId,
                        request
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Seat>> getAllSeats() {

        return ResponseEntity.ok(
                seatService.getAllSeats()
        );
    }

    @GetMapping("/screen/{screenId}")
    public ResponseEntity<List<Seat>> getSeatsByScreen(
            @PathVariable Long screenId
    ) {

        return ResponseEntity.ok(
                seatService.getSeatsByScreen(screenId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeat(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                seatService.getSeatById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seat> updateSeat(
            @PathVariable Long id,
            @RequestBody SeatRequest request
    ) {

        return ResponseEntity.ok(
                seatService.updateSeat(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(
            @PathVariable Long id
    ) {

        seatService.deleteSeat(id);

        return ResponseEntity.noContent().build();
    }
}