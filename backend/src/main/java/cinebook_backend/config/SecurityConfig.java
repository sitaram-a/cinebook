package cinebook_backend.config;

import cinebook_backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // ==========================================
    // PASSWORD ENCODER
    // ==========================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ==========================================
    // CORS
    // ==========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // ==========================================
    // SECURITY FILTER CHAIN
    // ==========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // JWT API -> disable CSRF
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors -> {})

                // JWT -> stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // ==========================================
                // AUTHORIZATION
                // ==========================================

                .authorizeHttpRequests(auth -> auth

                        // ----------------------------------
                        // CORS preflight
                        // ----------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // ----------------------------------
                        // AUTH
                        // ----------------------------------

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        ).permitAll()


                        // ==================================
                        // PUBLIC GET APIs
                        // ==================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/movies/**",
                                "/api/theatres/**",
                                "/api/screens/**",
                                "/api/seats/**",
                                "/api/shows/**",
                                "/api/show-seats/**"
                        ).permitAll()


                        // ==================================
                        // ADMIN MOVIES
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/movies/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/movies/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/movies/**"
                        ).hasRole("ADMIN")


                        // ==================================
                        // ADMIN THEATRES
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/theatres/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/theatres/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/theatres/**"
                        ).hasRole("ADMIN")


                        // ==================================
                        // ADMIN SCREENS
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/screens/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/screens/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/screens/**"
                        ).hasRole("ADMIN")


                        // ==================================
                        // ADMIN SEATS
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/seats/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/seats/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/seats/**"
                        ).hasRole("ADMIN")


                        // ==================================
                        // ADMIN SHOWS
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/shows/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/shows/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/shows/**"
                        ).hasRole("ADMIN")


                        // ==================================
                        // SHOW SEATS
                        // ==================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/show-seats/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/show-seats/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/show-seats/**"
                        ).hasRole("ADMIN")


                        // ==================================
                        // ADMIN APIs
                        // ==================================

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")


                        // ==================================
                        // ADMIN BOOKINGS (must precede the
                        // general /api/bookings/** rule below)
                        // ==================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/bookings/admin/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/bookings/*/admin-cancel"
                        ).hasRole("ADMIN")


                        // ==================================
                        // BOOKINGS
                        // ==================================

                        .requestMatchers(
                                "/api/bookings/**"
                        ).authenticated()


                        // ==================================
                        // EVERYTHING ELSE
                        // ==================================

                        .anyRequest().authenticated()
                )

                // ==========================================
                // JWT FILTER
                // ==========================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}