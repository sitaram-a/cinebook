package cinebook_backend.dto;

import cinebook_backend.entity.SeatType;

public record SeatRequest(
        String seatNumber,
        String rowName,
        SeatType seatType,
        Double price,
        Long screenId
) {
}