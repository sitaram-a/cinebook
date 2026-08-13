package cinebook_backend.dto;

public record ScreenRequest(
        String name,
        Integer totalSeats,
        Long theatreId
) {
}