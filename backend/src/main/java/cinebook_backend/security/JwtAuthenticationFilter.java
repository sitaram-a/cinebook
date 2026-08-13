package cinebook_backend.security;

import cinebook_backend.entity.User;
import cinebook_backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        // No JWT token
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            // Extract email from JWT
            String email =
                    jwtService.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                // Find user
                User user =
                        userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user != null) {

                    // User role is String
                    String role =
                            "ROLE_" + user.getRole();

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(role);

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user.getEmail(),
                                    null,
                                    List.of(authority)
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);

                    // Debug information
                    System.out.println(
                            "Authenticated user: "
                                    + user.getEmail()
                    );

                    System.out.println(
                            "User role: "
                                    + role
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT authentication failed: "
                            + e.getMessage()
            );

            SecurityContextHolder
                    .clearContext();
        }

        filterChain.doFilter(request, response);
    }
}