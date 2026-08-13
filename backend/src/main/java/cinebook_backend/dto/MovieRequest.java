package cinebook_backend.dto;

import java.time.LocalDate;

public record MovieRequest(
        String title,
        String description,
        String genre,
        String language,
        Integer duration,
        LocalDate releaseDate,
        String posterUrl,
        String trailerUrl,
        Double rating
) {
}