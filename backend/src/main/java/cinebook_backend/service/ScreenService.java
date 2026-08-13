package cinebook_backend.service;

import cinebook_backend.dto.ScreenRequest;
import cinebook_backend.entity.Screen;
import cinebook_backend.entity.Theatre;
import cinebook_backend.repository.ScreenRepository;
import cinebook_backend.repository.TheatreRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScreenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;

    public ScreenService(
            ScreenRepository screenRepository,
            TheatreRepository theatreRepository
    ) {
        this.screenRepository = screenRepository;
        this.theatreRepository = theatreRepository;
    }

    public Screen createScreen(ScreenRequest request) {

        Theatre theatre = theatreRepository.findById(request.theatreId())
                .orElseThrow(() ->
                        new RuntimeException("Theatre not found")
                );

        Screen screen = Screen.builder()
                .name(request.name())
                .totalSeats(request.totalSeats())
                .theatre(theatre)
                .build();

        return screenRepository.save(screen);
    }

    public List<Screen> getAllScreens() {
        return screenRepository.findAll();
    }

    public List<Screen> getScreensByTheatre(Long theatreId) {
        return screenRepository.findByTheatreId(theatreId);
    }

    public Screen getScreenById(Long id) {

        return screenRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Screen not found")
                );
    }

    public Screen updateScreen(
            Long id,
            ScreenRequest request
    ) {

        Screen screen = getScreenById(id);

        Theatre theatre = theatreRepository.findById(request.theatreId())
                .orElseThrow(() ->
                        new RuntimeException("Theatre not found")
                );

        screen.setName(request.name());
        screen.setTotalSeats(request.totalSeats());
        screen.setTheatre(theatre);

        return screenRepository.save(screen);
    }

    public void deleteScreen(Long id) {

        Screen screen = getScreenById(id);

        screenRepository.delete(screen);
    }
}