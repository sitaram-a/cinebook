package cinebook_backend.dto;

import java.util.List;

public record BookingRequest(
        Long showId,
        List<Long> showSeatIds
) {
}