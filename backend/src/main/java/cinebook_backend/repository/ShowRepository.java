package cinebook_backend.repository;

import cinebook_backend.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByMovieId(Long movieId);

    List<Show> findByScreenId(Long screenId);

    List<Show> findByMovieIdAndActiveTrue(Long movieId);

    List<Show> findByScreenIdAndActiveTrue(Long screenId);
}