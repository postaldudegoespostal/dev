package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.dto.requests.LoginRequest;
import com.arslanca.dev.business.dto.responses.AuthenticationResponse;
import com.arslanca.dev.core.utilities.ratelimit.RateLimitService;
import com.arslanca.dev.core.utilities.security.JwtSecurity;
import com.arslanca.dev.dataAccess.RefreshTokenRepository;
import com.arslanca.dev.dataAccess.RevokedTokenRepository;
import com.arslanca.dev.dataAccess.UserRepository;
import com.arslanca.dev.entities.RefreshToken;
import com.arslanca.dev.entities.RevokedToken;
import com.arslanca.dev.entities.User;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtSecurity jwtService;
    private final RateLimitService rateLimitService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RevokedTokenRepository revokedTokenRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        Bucket bucket = rateLimitService.resolveLoginBucket(httpRequest.getRemoteAddr());
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                   .body("Too many login attempts. Please try again later.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));

        var activeTokens = refreshTokenRepository.findByUserAndRevokedOrderByExpiryDateDesc(user, false);
        if (activeTokens.size() >= 5) {
            activeTokens.stream()
                    .skip(4)
                    .forEach(token -> token.setRevoked(true));
            refreshTokenRepository.saveAll(activeTokens);
        }

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        RefreshToken rt = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .revoked(false)
                .expiryDate(jwtService.extractExpiration(refreshToken).toInstant())
                .build();
        refreshTokenRepository.save(rt);

        Cookie accessCookie = new Cookie("access_token", jwtToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(15 * 60);


        Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/api/auth/refresh-token");
        refreshCookie.setMaxAge(request.isRememberMe() ? 15 * 24 * 60 * 60 : 24 * 60 * 60);
        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);
        return ResponseEntity.ok(AuthenticationResponse.builder().build());
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token cookie missing");
        }
        String username = jwtService.extractUsername(refreshToken);
        if (username != null) {
            var user = userRepository.findByUsername(username).orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {

                var storedToken = refreshTokenRepository.findByToken(refreshToken)
                        .orElse(null);

                if (storedToken == null || storedToken.isRevoked()) {
                     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or Revoked Token");
                }

                storedToken.setRevoked(true);
                refreshTokenRepository.save(storedToken);

                String newAccessToken = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);

                RefreshToken rt = RefreshToken.builder()
                    .user(user)
                    .token(newRefreshToken)
                    .revoked(false)
                    .expiryDate(jwtService.extractExpiration(newRefreshToken).toInstant())
                    .build();
                refreshTokenRepository.save(rt);

                Cookie accessCookie = new Cookie("access_token", newAccessToken);
                accessCookie.setHttpOnly(true);
                accessCookie.setSecure(false);
                accessCookie.setPath("/");
                accessCookie.setMaxAge(15 * 60);

                Cookie refreshCookie = new Cookie("refresh_token", newRefreshToken);
                refreshCookie.setHttpOnly(true);
                refreshCookie.setSecure(false);
                refreshCookie.setPath("/api/auth/refresh-token");
                refreshCookie.setMaxAge(15 * 24 * 60 * 60);

                response.addCookie(accessCookie);
                response.addCookie(refreshCookie);

                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "access_token", required = false) String accessToken,
            @CookieValue(name = "refresh_token", required = false) String refreshTokenToken,
            HttpServletResponse response
    ) {
        if (refreshTokenToken != null) {
            var storedToken = refreshTokenRepository.findByToken(refreshTokenToken).orElse(null);
            if (storedToken != null) {
                storedToken.setRevoked(true);
                refreshTokenRepository.save(storedToken);
            }
        }

        if (accessToken != null) {
             RevokedToken revokedToken = RevokedToken.builder()
                .token(accessToken)
                .expiryDate(jwtService.extractExpiration(accessToken).toInstant())
                .build();
             revokedTokenRepository.save(revokedToken);
        }

        Cookie accessCookie = new Cookie("access_token", null);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);

        Cookie refreshCookie = new Cookie("refresh_token", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/api/auth/refresh-token");
        refreshCookie.setMaxAge(0);

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok("Logged out successfully");
    }
    @GetMapping("/check")
    public ResponseEntity<?> checkStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
