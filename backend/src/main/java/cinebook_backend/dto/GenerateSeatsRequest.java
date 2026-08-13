package cinebook_backend.dto;

import cinebook_backend.entity.SeatType;

public record GenerateSeatsRequest(
        Long screenId,
        Integer rows,
        Integer seatsPerRow,
        SeatType seatType,
        Double price
) {
}