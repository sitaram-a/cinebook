package cinebook_backend.service;

import cinebook_backend.dto.BookingRequest;
import cinebook_backend.entity.*;
import cinebook_backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final UserRepository userRepository;
    

    public BookingService(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            ShowRepository showRepository,
            ShowSeatRepository showSeatRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // CREATE BOOKING
    // ==========================================

    @Transactional
    public Booking createBooking(
            BookingRequest request,
            String userEmail
    ) {

        // Find logged-in user using JWT email
        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // Find show
        Show show = showRepository.findById(request.showId())
                .orElseThrow(() ->
                        new RuntimeException("Show not found")
                );

        // Check if show is active
        if (!show.getActive()) {
            throw new RuntimeException("Show is not active");
        }

        // Check seats
        if (request.showSeatIds() == null ||
                request.showSeatIds().isEmpty()) {

            throw new RuntimeException(
                    "Please select at least one seat"
            );
        }

        // Check for duplicate seat IDs
if (request.showSeatIds().size()
        != request.showSeatIds().stream().distinct().count()) {

    throw new RuntimeException(
            "Duplicate seats are not allowed"
    );
}

        List<BookingSeat> bookingSeats = new ArrayList<>();

        double totalAmount = 0;

        // ==========================================
        // PROCESS SELECTED SEATS
        // ==========================================

        for (Long showSeatId : request.showSeatIds()) {

            ShowSeat showSeat = showSeatRepository
        .findByIdForUpdate(showSeatId)
        .orElseThrow(() ->
                new RuntimeException(
                        "Show seat not found: " + showSeatId
                )
        );

            // Make sure seat belongs to this show
            if (!showSeat.getShow().getId()
                    .equals(show.getId())) {

                throw new RuntimeException(
                        "Seat does not belong to this show"
                );
            }

            // Check availability
            if (showSeat.getStatus() != SeatStatus.AVAILABLE) {

                throw new RuntimeException(
                        "Seat " +
                        showSeat.getSeat().getSeatNumber() +
                        " is not available"
                );
            }

            // Mark seat as booked
            showSeat.setStatus(SeatStatus.BOOKED);

            showSeatRepository.save(showSeat);

            // Add price
            totalAmount += showSeat.getSeat().getPrice();

            // Create BookingSeat
            BookingSeat bookingSeat = BookingSeat.builder()
                    .showSeat(showSeat)
                    .price(showSeat.getSeat().getPrice())
                    .build();

            bookingSeats.add(bookingSeat);
        }

        // ==========================================
        // CREATE BOOKING
        // ==========================================

        Booking booking = Booking.builder()
                .user(user)
                .show(show)
                .bookingReference(
                        generateBookingReference()
                )
                .totalAmount(totalAmount)
                .status(BookingStatus.CONFIRMED)
                .createdAt(LocalDateTime.now())
                .build();

        Booking savedBooking =
                bookingRepository.save(booking);

        // ==========================================
        // SAVE BOOKING SEATS
        // ==========================================

        for (BookingSeat bookingSeat : bookingSeats) {

            bookingSeat.setBooking(savedBooking);
        }

        bookingSeatRepository.saveAll(bookingSeats);

        return savedBooking;
    }

    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    @Transactional
    public Booking cancelBooking(
        Long bookingId,
        String userEmail
) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Booking not found"
                    )
            );

    // Check booking ownership
    if (!booking.getUser().getEmail()
            .equalsIgnoreCase(userEmail)) {

        throw new RuntimeException(
                "You are not authorized to cancel this booking"
        );
    }

    // Already cancelled?
    if (booking.getStatus() == BookingStatus.CANCELLED) {

        throw new RuntimeException(
                "Booking is already cancelled"
        );
    }

    // Make seats available again
    for (BookingSeat bookingSeat :
            booking.getBookingSeats()) {

        ShowSeat showSeat =
                bookingSeat.getShowSeat();

        showSeat.setStatus(
                SeatStatus.AVAILABLE
        );

        showSeatRepository.save(showSeat);
    }

    // Change booking status
    booking.setStatus(
            BookingStatus.CANCELLED
    );

    return bookingRepository.save(booking);
}

    // ==========================================
    // GET BOOKING BY ID
    // ==========================================

   public Booking getBookingById(
        Long id,
        String userEmail
) {

    Booking booking = bookingRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Booking not found"
                    )
            );

    if (!booking.getUser().getEmail()
            .equalsIgnoreCase(userEmail)) {

        throw new RuntimeException(
                "You are not authorized to view this booking"
        );
    }

    return booking;
}

    // ==========================================
    // GET BOOKING BY REFERENCE
    // ==========================================

   public Booking getBookingByReference(
        String bookingReference,
        String userEmail
) {

    Booking booking = bookingRepository
            .findByBookingReference(bookingReference)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Booking not found"
                    )
            );

    if (!booking.getUser().getEmail()
            .equalsIgnoreCase(userEmail)) {

        throw new RuntimeException(
                "You are not authorized to view this booking"
        );
    }

    return booking;
}

    // ==========================================
    // GET BOOKINGS BY USER ID
    // ==========================================

    public List<Booking> getBookingsByUser(
            Long userId
    ) {

        return bookingRepository.findByUserId(userId);
    }

    // ==========================================
    // GET BOOKINGS BY LOGGED-IN USER EMAIL
    // ==========================================

    public List<Booking> getBookingsByUserEmail(
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return bookingRepository.findByUserId(
                user.getId()
        );
    }

    // ==========================================
    // GET ALL BOOKINGS (ADMIN)
    // ==========================================

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    // ==========================================
    // CANCEL BOOKING (ADMIN — no ownership check)
    // ==========================================

    @Transactional
    public Booking adminCancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        )
                );

        if (booking.getStatus() == BookingStatus.CANCELLED) {

            throw new RuntimeException(
                    "Booking is already cancelled"
            );
        }

        for (BookingSeat bookingSeat :
                booking.getBookingSeats()) {

            ShowSeat showSeat =
                    bookingSeat.getShowSeat();

            showSeat.setStatus(
                    SeatStatus.AVAILABLE
            );

            showSeatRepository.save(showSeat);
        }

        booking.setStatus(
                BookingStatus.CANCELLED
        );

        return bookingRepository.save(booking);
    }

    // ==========================================
    // GENERATE BOOKING REFERENCE
    // ==========================================

    private String generateBookingReference() {

        return "CB-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }
}