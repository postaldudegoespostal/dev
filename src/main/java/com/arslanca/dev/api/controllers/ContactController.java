package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.ContactService;
import com.arslanca.dev.business.requests.SendMailRequest;
import com.arslanca.dev.core.utilities.ratelimit.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final RateLimitService rateLimitService;

    @PostMapping
    public ResponseEntity<String> sendMessage(@RequestBody SendMailRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        Bucket bucket = rateLimitService.resolveBucket(ipAddress);

        if (bucket.tryConsume(1)) {
            contactService.send(request);
            return ResponseEntity.ok("Mesajınız başarıyla gönderildi.");
        } else {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Çok fazla mesaj gönderdiniz. Lütfen 1 saat sonra tekrar deneyin.");
        }
    }
}