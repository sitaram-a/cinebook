package cinebook_backend.service;

import cinebook_backend.entity.User;
import cinebook_backend.repository.UserRepository;
import cinebook_backend.security.JwtService;

import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public CurrentUserService(
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User getCurrentUser(String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            throw new RuntimeException(
                    "Authorization token is missing"
            );
        }

        String token =
                authorizationHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
}