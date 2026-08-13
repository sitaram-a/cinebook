package cinebook_backend.repository;

import cinebook_backend.entity.SeatStatus;
import cinebook_backend.entity.ShowSeat;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ShowSeatRepository
        extends JpaRepository<ShowSeat, Long> {

    // Get all seats for a show
    @Query("""
        SELECT ss
        FROM ShowSeat ss
        JOIN FETCH ss.seat s
        WHERE ss.show.id = :showId
        ORDER BY s.rowName ASC, s.seatNumber ASC
        """)
List<ShowSeat> findByShowId(
        @Param("showId") Long showId
);

    // Get seats by show and status
    List<ShowSeat> findByShowIdAndStatus(
            Long showId,
            SeatStatus status
    );

    // Lock a particular seat while booking
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT ss
            FROM ShowSeat ss
            WHERE ss.id = :id
            """)
    Optional<ShowSeat> findByIdForUpdate(
            @Param("id") Long id
    );
}