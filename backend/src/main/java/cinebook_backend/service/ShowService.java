package cinebook_backend.service;

import cinebook_backend.dto.ShowRequest;
import cinebook_backend.entity.Movie;
import cinebook_backend.entity.Screen;
import cinebook_backend.entity.Show;
import cinebook_backend.repository.MovieRepository;
import cinebook_backend.repository.ScreenRepository;
import cinebook_backend.repository.ShowRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final ShowSeatService showSeatService;

    public ShowService(
            ShowRepository showRepository,
            MovieRepository movieRepository,
            ScreenRepository screenRepository,
            ShowSeatService showSeatService
    ) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.screenRepository = screenRepository;
        this.showSeatService = showSeatService;
    }

    // =========================================================
    // CREATE SHOW
    // =========================================================

    @Transactional
    public Show createShow(ShowRequest request) {

        Movie movie = movieRepository.findById(request.movieId())
                .orElseThrow(() ->
                        new RuntimeException("Movie not found")
                );

        Screen screen = screenRepository.findById(request.screenId())
                .orElseThrow(() ->
                        new RuntimeException("Screen not found")
                );

        Show show = Show.builder()
                .movie(movie)
                .screen(screen)
                .startTime(request.startTime())
                .endTime(request.endTime())
                .price(request.price())
                .active(
                        request.active() == null
                                ? true
                                : request.active()
                )
                .build();

        // Save show first so it gets an ID
        Show savedShow = showRepository.save(show);

        // Generate ShowSeat records
        showSeatService.generateSeatsForShow(
                savedShow.getId()
        );

        return savedShow;
    }

    // =========================================================
    // GET ALL SHOWS
    // =========================================================

    public List<Show> getAllShows() {

        return showRepository.findAll();
    }

    // =========================================================
    // GET SHOW
    // =========================================================

    public Show getShowById(Long id) {

        return showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Show not found")
                );
    }

    // =========================================================
    // GET SHOWS BY MOVIE
    // =========================================================

    public List<Show> getShowsByMovie(Long movieId) {

        return showRepository.findByMovieId(movieId);
    }

    // =========================================================
    // GET SHOWS BY SCREEN
    // =========================================================

    public List<Show> getShowsByScreen(Long screenId) {

        return showRepository.findByScreenId(screenId);
    }

    // =========================================================
    // GET ACTIVE SHOWS BY MOVIE
    // =========================================================

    public List<Show> getActiveShowsByMovie(Long movieId) {

        return showRepository.findByMovieIdAndActiveTrue(
                movieId
        );
    }

    // =========================================================
    // UPDATE SHOW
    // =========================================================

    public Show updateShow(
            Long id,
            ShowRequest request
    ) {

        Show show = getShowById(id);

        Movie movie = movieRepository.findById(
                request.movieId()
        ).orElseThrow(() ->
                new RuntimeException("Movie not found")
        );

        Screen screen = screenRepository.findById(
                request.screenId()
        ).orElseThrow(() ->
                new RuntimeException("Screen not found")
        );

        show.setMovie(movie);
        show.setScreen(screen);
        show.setStartTime(request.startTime());
        show.setEndTime(request.endTime());
        show.setPrice(request.price());

        show.setActive(
                request.active() == null
                        ? true
                        : request.active()
        );

        return showRepository.save(show);
    }

    // =========================================================
    // DELETE SHOW
    // =========================================================

    public void deleteShow(Long id) {

        Show show = getShowById(id);

        showRepository.delete(show);
    }
}