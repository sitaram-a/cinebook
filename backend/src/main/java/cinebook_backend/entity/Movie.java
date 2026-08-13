package cinebook_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String genre;

    private String language;

    private Integer duration;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "poster_url", length = 1000)
    private String posterUrl;

    @Column(name = "trailer_url", length = 1000)
    private String trailerUrl;

    private Double rating;
}