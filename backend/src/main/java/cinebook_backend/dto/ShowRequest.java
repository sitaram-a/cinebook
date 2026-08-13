package cinebook_backend.dto;

import java.time.LocalDateTime;

public record ShowRequest(
        Long movieId,
        Long screenId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Double price,
        Boolean active
) {
}