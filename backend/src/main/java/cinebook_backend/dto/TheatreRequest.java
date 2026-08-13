package cinebook_backend.dto;

public record TheatreRequest(
        String name,
        String address,
        String city,
        Integer totalScreens
) {
}