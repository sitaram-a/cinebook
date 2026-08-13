package cinebook_backend.controller;

import cinebook_backend.dto.BookingRequest;
import cinebook_backend.entity.Booking;
import cinebook_backend.service.BookingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ==========================================
    // CREATE BOOKING
    // ==========================================

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        bookingService.createBooking(
                                request,
                                authentication.getName()
                        )
                );
    }

    // ==========================================
    // GET MY BOOKINGS
    // ==========================================

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingsByUserEmail(
                        authentication.getName()
                )
        );
    }

    // ==========================================
    // GET BOOKING BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingById(
                        id,
                        authentication.getName()
                )
        );
    }

    // ==========================================
    // GET BOOKING BY REFERENCE
    // ==========================================

    @GetMapping("/reference/{reference}")
    public ResponseEntity<Booking> getBookingByReference(
            @PathVariable String reference,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingByReference(
                        reference,
                        authentication.getName()
                )
        );
    }

    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(
                        id,
                        authentication.getName()
                )
        );
    }

    // ==========================================
    // GET ALL BOOKINGS (ADMIN)
    // ==========================================

    @GetMapping("/admin/all")
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    // ==========================================
    // CANCEL ANY BOOKING (ADMIN)
    // ==========================================

    @PutMapping("/{id}/admin-cancel")
    public ResponseEntity<Booking> adminCancelBooking(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                bookingService.adminCancelBooking(id)
        );
    }
}