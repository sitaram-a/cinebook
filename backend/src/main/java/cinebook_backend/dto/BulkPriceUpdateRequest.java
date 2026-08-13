package cinebook_backend.dto;

import cinebook_backend.entity.SeatType;

public record BulkPriceUpdateRequest(
        SeatType seatType,
        Double price
) {
}