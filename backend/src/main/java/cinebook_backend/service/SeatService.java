package cinebook_backend.service;

import cinebook_backend.dto.BulkPriceUpdateRequest;
import cinebook_backend.dto.GenerateSeatsRequest;
import cinebook_backend.dto.SeatRequest;
import cinebook_backend.entity.Screen;
import cinebook_backend.entity.Seat;
import cinebook_backend.repository.ScreenRepository;
import cinebook_backend.repository.SeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final ScreenRepository screenRepository;

    public SeatService(
            SeatRepository seatRepository,
            ScreenRepository screenRepository
    ) {
        this.seatRepository = seatRepository;
        this.screenRepository = screenRepository;
    }


    // =========================================================
    // CREATE SINGLE SEAT
    // =========================================================

    public Seat createSeat(SeatRequest request) {

        Screen screen = screenRepository
                .findById(request.screenId())
                .orElseThrow(() ->
                        new RuntimeException("Screen not found")
                );

        Seat seat = Seat.builder()
                .seatNumber(request.seatNumber())
                .rowName(request.rowName())
                .seatType(request.seatType())
                .price(request.price())
                .screen(screen)
                .build();

        return seatRepository.save(seat);
    }


    // =========================================================
    // GENERATE MULTIPLE SEATS
    // =========================================================

    @Transactional
    public List<Seat> generateSeats(
            GenerateSeatsRequest request
    ) {


    if (request.screenId() == null) {
        throw new RuntimeException("Screen ID is required");
    }

    if (request.rows() == null || request.rows() <= 0) {
        throw new RuntimeException(
                "Number of rows must be greater than 0"
        );
    }

    if (request.seatsPerRow() == null ||
            request.seatsPerRow() <= 0) {

        throw new RuntimeException(
                "Seats per row must be greater than 0"
        );
    }

    if (request.seatType() == null) {
        throw new RuntimeException(
                "Seat type is required"
        );
    }

    if (request.price() == null || request.price() <= 0) {
        throw new RuntimeException(
                "Seat price must be greater than 0"
        );
    }

        // Validate screen
        Screen screen = screenRepository
                .findById(request.screenId())
                .orElseThrow(() ->
                        new RuntimeException("Screen not found")
                );


        // Validate rows
        if (request.rows() == null ||
                request.rows() <= 0) {

            throw new RuntimeException(
                    "Number of rows must be greater than 0"
            );
        }


        // Validate seats per row
        if (request.seatsPerRow() == null ||
                request.seatsPerRow() <= 0) {

            throw new RuntimeException(
                    "Seats per row must be greater than 0"
            );
        }


        // Validate seat type
        if (request.seatType() == null) {

            throw new RuntimeException(
                    "Seat type is required"
            );
        }


        // Validate price
        if (request.price() == null ||
                request.price() <= 0) {

            throw new RuntimeException(
                    "Seat price must be greater than 0"
            );
        }


        // Check existing seats
        List<Seat> existingSeats =
                seatRepository.findByScreenId(
                        request.screenId()
                );


        /*
         * Prevent accidentally generating duplicate seats.
         *
         * If the screen already contains seats,
         * we stop the operation.
         */

        if (!existingSeats.isEmpty()) {

            throw new RuntimeException(
                    "This screen already has seats. " +
                    "Delete existing seats before generating a new layout."
            );
        }


        List<Seat> seats = new ArrayList<>();


        /*
         * Generate rows:
         *
         * 1 -> A
         * 2 -> B
         * 3 -> C
         * ...
         */

        for (int row = 0;
             row < request.rows();
             row++) {

            String rowName =
                    generateRowName(row);


            /*
             * Generate seats:
             *
             * A1
             * A2
             * A3
             * ...
             */

            for (int seatNumber = 1;
                 seatNumber <= request.seatsPerRow();
                 seatNumber++) {

                String seatName =
                        rowName + seatNumber;


                Seat seat = Seat.builder()
                        .seatNumber(seatName)
                        .rowName(rowName)
                        .seatType(request.seatType())
                        .price(request.price())
                        .screen(screen)
                        .build();

                seats.add(seat);
            }
        }


        return seatRepository.saveAll(seats);
    }


    // =========================================================
    // ADD A BATCH OF SEATS TO A SCREEN THAT ALREADY HAS SEATS
    // (continues row lettering after the existing rows,
    // e.g. adding PREMIUM rows on top of existing REGULAR ones)
    // =========================================================

    @Transactional
    public List<Seat> addSeats(
            GenerateSeatsRequest request
    ) {

        if (request.screenId() == null) {
            throw new RuntimeException("Screen ID is required");
        }

        if (request.rows() == null || request.rows() <= 0) {
            throw new RuntimeException(
                    "Number of rows must be greater than 0"
            );
        }

        if (request.seatsPerRow() == null ||
                request.seatsPerRow() <= 0) {

            throw new RuntimeException(
                    "Seats per row must be greater than 0"
            );
        }

        if (request.seatType() == null) {
            throw new RuntimeException(
                    "Seat type is required"
            );
        }

        if (request.price() == null || request.price() <= 0) {
            throw new RuntimeException(
                    "Seat price must be greater than 0"
            );
        }

        Screen screen = screenRepository
                .findById(request.screenId())
                .orElseThrow(() ->
                        new RuntimeException("Screen not found")
                );

        List<Seat> existingSeats =
                seatRepository.findByScreenId(
                        request.screenId()
                );

        /*
         * Start the new batch of rows right after the
         * highest existing row letter, so newly added
         * rows never collide with existing ones.
         *
         * If the screen has no seats yet, this behaves
         * exactly like generateSeats (starts at row A).
         */
        int nextRowIndex = 0;

        for (Seat existing : existingSeats) {

            int existingIndex =
                    rowNameToIndex(existing.getRowName());

            if (existingIndex + 1 > nextRowIndex) {
                nextRowIndex = existingIndex + 1;
            }
        }

        List<Seat> seats = new ArrayList<>();

        for (int row = 0;
             row < request.rows();
             row++) {

            String rowName =
                    generateRowName(nextRowIndex + row);

            for (int seatNumber = 1;
                 seatNumber <= request.seatsPerRow();
                 seatNumber++) {

                String seatName =
                        rowName + seatNumber;

                Seat seat = Seat.builder()
                        .seatNumber(seatName)
                        .rowName(rowName)
                        .seatType(request.seatType())
                        .price(request.price())
                        .screen(screen)
                        .build();

                seats.add(seat);
            }
        }

        return seatRepository.saveAll(seats);
    }


    // =========================================================
    // BULK UPDATE PRICE FOR ALL SEATS OF A GIVEN TYPE
    // ON A SCREEN (e.g. re-price every PREMIUM seat at once)
    // =========================================================

    @Transactional
    public List<Seat> bulkUpdatePrice(
            Long screenId,
            BulkPriceUpdateRequest request
    ) {

        if (request.seatType() == null) {
            throw new RuntimeException(
                    "Seat type is required"
            );
        }

        if (request.price() == null || request.price() <= 0) {
            throw new RuntimeException(
                    "Price must be greater than 0"
            );
        }

        List<Seat> matchingSeats =
                seatRepository.findByScreenId(screenId)
                        .stream()
                        .filter(seat ->
                                seat.getSeatType() ==
                                        request.seatType()
                        )
                        .toList();

        if (matchingSeats.isEmpty()) {

            throw new RuntimeException(
                    "No seats of type " +
                    request.seatType() +
                    " found on this screen"
            );
        }

        matchingSeats.forEach(seat ->
                seat.setPrice(request.price())
        );

        return seatRepository.saveAll(matchingSeats);
    }


    // =========================================================
    // ROW NAME -> INDEX  (reverse of generateRowName)
    // A -> 0, B -> 1, ... Z -> 25, AA -> 26, AB -> 27, ...
    // =========================================================

    private int rowNameToIndex(String rowName) {

        int result = 0;

        for (char c : rowName.toCharArray()) {

            result = result * 26 + (c - 'A' + 1);
        }

        return result - 1;
    }


    // =========================================================
    // GENERATE ROW NAME
    // =========================================================

    private String generateRowName(int index) {

        StringBuilder rowName =
                new StringBuilder();

        int number = index;

        do {

            rowName.insert(
                    0,
                    (char) ('A' + (number % 26))
            );

            number =
                    (number / 26) - 1;

        } while (number >= 0);

        return rowName.toString();
    }


    // =========================================================
    // GET ALL SEATS
    // =========================================================

    public List<Seat> getAllSeats() {

        return seatRepository.findAll();
    }


    // =========================================================
    // GET SEATS BY SCREEN
    // =========================================================

    public List<Seat> getSeatsByScreen(
            Long screenId
    ) {

        return seatRepository.findByScreenId(
                screenId
        );
    }


    // =========================================================
    // GET SEAT BY ID
    // =========================================================

    public Seat getSeatById(Long id) {

        return seatRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Seat not found"
                        )
                );
    }


    // =========================================================
    // UPDATE SEAT
    // =========================================================

    public Seat updateSeat(
            Long id,
            SeatRequest request
    ) {

        Seat seat = getSeatById(id);

        Screen screen = screenRepository
                .findById(request.screenId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Screen not found"
                        )
                );

        seat.setSeatNumber(
                request.seatNumber()
        );

        seat.setRowName(
                request.rowName()
        );

        seat.setSeatType(
                request.seatType()
        );

        seat.setPrice(
                request.price()
        );

        seat.setScreen(screen);

        return seatRepository.save(seat);
    }


    // =========================================================
    // DELETE SEAT
    // =========================================================

    public void deleteSeat(Long id) {

        Seat seat = getSeatById(id);

        seatRepository.delete(seat);
    }
}