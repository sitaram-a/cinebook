package cinebook_backend.config;

import cinebook_backend.entity.*;
import cinebook_backend.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:admin@cinebook.com}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:Admin@123}")
    private String adminPassword;

    public DataInitializer(
            UserRepository userRepository,
            MovieRepository movieRepository,
            TheatreRepository theatreRepository,
            ScreenRepository screenRepository,
            SeatRepository seatRepository,
            ShowRepository showRepository,
            ShowSeatRepository showSeatRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        createAdmin();

        // Don't recreate all data if it already exists
        if (movieRepository.count() > 0) {
            System.out.println("======================================");
            System.out.println("CINEBOOK DATA ALREADY EXISTS");
            System.out.println("======================================");
            return;
        }

        createMovies();
        createTheatre();
        createShows();

        System.out.println("======================================");
        System.out.println("CINEBOOK INITIAL DATA READY");
        System.out.println("Admin: " + adminEmail);
        System.out.println("======================================");
    }


    // =====================================================
    // ADMIN USER
    // =====================================================

    private void createAdmin() {

        if (userRepository.existsByEmail(adminEmail)) {

            System.out.println("Admin already exists: " + adminEmail);

            return;
        }

        User admin = User.builder()
                .name("CineBook Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role("ADMIN")
                .build();

        userRepository.save(admin);

        System.out.println("======================================");
        System.out.println("ADMIN USER CREATED");
        System.out.println("Email: " + adminEmail);
        System.out.println("======================================");
    }


    // =====================================================
    // MOVIES
    // =====================================================

    private void createMovies() {

        Movie movie1 = Movie.builder()
                .title("Avengers: Endgame")
                .description("The Avengers face their greatest battle.")
                .genre("Action")
                .language("English")
                .duration(181)
                .releaseDate(LocalDate.of(2019, 4, 26))
                .posterUrl(
                        "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
                )
                .trailerUrl(
                        "https://www.youtube.com/watch?v=TcMBFSGVi1c"
                )
                .rating(8.4)
                .build();


        Movie movie2 = Movie.builder()
                .title("Interstellar")
                .description("A team of explorers travels through a wormhole.")
                .genre("Sci-Fi")
                .language("English")
                .duration(169)
                .releaseDate(LocalDate.of(2014, 11, 7))
                .posterUrl(
                        "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
                )
                .trailerUrl(
                        "https://www.youtube.com/watch?v=zSWdZVtXT7E"
                )
                .rating(8.7)
                .build();


        Movie movie3 = Movie.builder()
                .title("Inception")
                .description("A thief enters people's dreams to steal secrets.")
                .genre("Sci-Fi")
                .language("English")
                .duration(148)
                .releaseDate(LocalDate.of(2010, 7, 16))
                .posterUrl(
                        "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
                )
                .trailerUrl(
                        "https://www.youtube.com/watch?v=YoHD9XEInc0"
                )
                .rating(8.8)
                .build();


        movieRepository.saveAll(
                List.of(movie1, movie2, movie3)
        );
    }


    // =====================================================
    // THEATRE + SCREENS + SEATS
    // =====================================================

    private void createTheatre() {

        Theatre theatre = Theatre.builder()
                .name("CineBook Central")
                .address("Main Road, City Center")
                .city("Jamshedpur")
                .totalScreens(2)
                .build();

        theatreRepository.save(theatre);


        Screen screen1 = Screen.builder()
                .name("Screen 1")
                .totalSeats(50)
                .theatre(theatre)
                .build();

        Screen screen2 = Screen.builder()
                .name("Screen 2")
                .totalSeats(50)
                .theatre(theatre)
                .build();

        screenRepository.saveAll(
                List.of(screen1, screen2)
        );


        createSeats(screen1);
        createSeats(screen2);
    }


    // =====================================================
    // SEATS
    // =====================================================

    private void createSeats(Screen screen) {

        List<Seat> seats = new ArrayList<>();

        String[] rows = {
                "A",
                "B",
                "C",
                "D",
                "E"
        };

        for (String row : rows) {

            for (int number = 1; number <= 10; number++) {

                SeatType seatType =
                        row.equals("E")
                                ? SeatType.PREMIUM
                                : SeatType.REGULAR;

                double price =
                        seatType == SeatType.PREMIUM
                                ? 250.0
                                : 180.0;

                Seat seat = Seat.builder()
                        .seatNumber(row + number)
                        .rowName(row)
                        .seatType(seatType)
                        .price(price)
                        .screen(screen)
                        .build();

                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);
    }


    // =====================================================
    // SHOWS
    // =====================================================

    private void createShows() {

        List<Movie> movies =
                movieRepository.findAll();

        List<Screen> screens =
                screenRepository.findAll();

        if (movies.isEmpty() || screens.isEmpty()) {
            return;
        }

        LocalDateTime tomorrow =
                LocalDateTime.now()
                        .plusDays(1)
                        .withHour(18)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0);


        for (int i = 0; i < movies.size(); i++) {

            Movie movie = movies.get(i);

            Screen screen =
                    screens.get(
                            i % screens.size()
                    );

            LocalDateTime startTime =
                    tomorrow.plusHours(i * 2L);

            LocalDateTime endTime =
                    startTime.plusMinutes(
                            movie.getDuration()
                    );

            Show show = Show.builder()
                    .movie(movie)
                    .screen(screen)
                    .startTime(startTime)
                    .endTime(endTime)
                    .price(200.0)
                    .active(true)
                    .build();

            showRepository.save(show);

            createShowSeats(show, screen);
        }
    }


    // =====================================================
    // SHOW SEATS
    // =====================================================

    private void createShowSeats(
            Show show,
            Screen screen
    ) {

        List<Seat> seats =
                seatRepository.findByScreenId(
                        screen.getId()
                );

        List<ShowSeat> showSeats =
                new ArrayList<>();

        for (Seat seat : seats) {

            ShowSeat showSeat =
                    ShowSeat.builder()
                            .show(show)
                            .seat(seat)
                            .status(
                                    SeatStatus.AVAILABLE
                            )
                            .build();

            showSeats.add(showSeat);
        }

        showSeatRepository.saveAll(showSeats);
    }
}