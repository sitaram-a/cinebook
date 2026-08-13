package cinebook_backend.service;

import cinebook_backend.entity.Seat;
import cinebook_backend.entity.SeatStatus;
import cinebook_backend.entity.Show;
import cinebook_backend.entity.ShowSeat;
import cinebook_backend.repository.SeatRepository;
import cinebook_backend.repository.ShowRepository;
import cinebook_backend.repository.ShowSeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShowSeatService {

    private final ShowSeatRepository showSeatRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;

    public ShowSeatService(
            ShowSeatRepository showSeatRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository
    ) {
        this.showSeatRepository = showSeatRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
    }

    // =========================================================
    // GENERATE SEATS FOR SHOW
    // =========================================================

    @Transactional
    public void generateSeatsForShow(Long showId) {

        // 1. Find show
        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new RuntimeException("Show not found")
                );

        // 2. Check if ShowSeat records already exist
        List<ShowSeat> existingShowSeats =
                showSeatRepository.findByShowId(showId);

        if (!existingShowSeats.isEmpty()) {
            return;
        }

        // 3. Get seats from the show's screen
        List<Seat> seats =
                seatRepository.findByScreenId(
                        show.getScreen().getId()
                );

        // 4. Screen has no seats
        if (seats.isEmpty()) {
            throw new RuntimeException(
                    "No seats found for this screen"
            );
        }

        // 5. Create ShowSeat records
        List<ShowSeat> showSeats =
                new ArrayList<>();

        for (Seat seat : seats) {

            ShowSeat showSeat = ShowSeat.builder()
                    .show(show)
                    .seat(seat)
                    .status(SeatStatus.AVAILABLE)
                    .build();

            showSeats.add(showSeat);
        }

        // 6. Save all
        showSeatRepository.saveAll(showSeats);
    }

    // =========================================================
    // GET ALL SEATS FOR SHOW
    // =========================================================

    public List<ShowSeat> getSeatsForShow(Long showId) {

        return showSeatRepository.findByShowId(showId);
    }

    // =========================================================
    // GET AVAILABLE SEATS
    // =========================================================

    public List<ShowSeat> getAvailableSeats(Long showId) {

        return showSeatRepository.findByShowIdAndStatus(
                showId,
                SeatStatus.AVAILABLE
        );
    }
}