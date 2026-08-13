package cinebook_backend.repository;

import cinebook_backend.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingSeatRepository
        extends JpaRepository<BookingSeat, Long> {
}