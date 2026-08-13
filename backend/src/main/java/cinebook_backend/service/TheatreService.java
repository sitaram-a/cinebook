package cinebook_backend.service;

import cinebook_backend.dto.TheatreRequest;
import cinebook_backend.entity.Theatre;
import cinebook_backend.repository.TheatreRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheatreService {

    private final TheatreRepository theatreRepository;

    public TheatreService(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    public Theatre createTheatre(TheatreRequest request) {

        Theatre theatre = Theatre.builder()
                .name(request.name())
                .address(request.address())
                .city(request.city())
                .totalScreens(request.totalScreens())
                .build();

        return theatreRepository.save(theatre);
    }

    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }

    public Theatre getTheatreById(Long id) {

        return theatreRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Theatre not found")
                );
    }

    public Theatre updateTheatre(
            Long id,
            TheatreRequest request
    ) {

        Theatre theatre = getTheatreById(id);

        theatre.setName(request.name());
        theatre.setAddress(request.address());
        theatre.setCity(request.city());
        theatre.setTotalScreens(request.totalScreens());

        return theatreRepository.save(theatre);
    }

    public void deleteTheatre(Long id) {

        Theatre theatre = getTheatreById(id);

        theatreRepository.delete(theatre);
    }
}