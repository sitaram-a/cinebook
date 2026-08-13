package cinebook_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> dashboard() {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Welcome to CineBook Admin Dashboard"
                )
        );
    }
}