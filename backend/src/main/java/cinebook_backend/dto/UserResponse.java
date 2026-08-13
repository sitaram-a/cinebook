package cinebook_backend.dto;

public record UserResponse(
        Long id,
        String name,
        String email,
        String role
) {
}