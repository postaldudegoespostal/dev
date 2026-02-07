package com.arslanca.dev.core.utilities.scheduler;

import com.arslanca.dev.dataAccess.RefreshTokenRepository;
import com.arslanca.dev.dataAccess.RevokedTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class TokenCleanupService {

    private final RevokedTokenRepository revokedTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanupExpiredRevokedTokens() {
        try {
            Instant now = Instant.now();
            int deleted = revokedTokenRepository.deleteByExpiryDateBefore(now);
            if (deleted > 0) {
                log.info("Cleaned up {} expired revoked access tokens", deleted);
            }
        } catch (Exception e) {
            log.error("Error during revoked token cleanup", e);
        }
    }
    @Scheduled(cron = "0 0 2 * * *") // Every day at 2:00 AM
    @Transactional
    public void cleanupExpiredRefreshTokens() {
        try {
            Instant now = Instant.now();
            int deleted = refreshTokenRepository.deleteByExpiryDateBefore(now);
            if (deleted > 0) {
                log.info("Cleaned up {} expired refresh tokens", deleted);
            }
        } catch (Exception e) {
            log.error("Error during refresh token cleanup", e);
        }
    }
    @Scheduled(cron = "0 0 3 * * SUN")
    @Transactional
    public void cleanupOldRevokedRefreshTokens() {
        try {
            Instant thirtyDaysAgo = Instant.now().minusSeconds(30L * 24 * 60 * 60);
            int deleted = refreshTokenRepository.deleteByRevokedAndExpiryDateBefore(true, thirtyDaysAgo);
            if (deleted > 0) {
                log.info("Cleaned up {} old revoked refresh tokens", deleted);
            }
        } catch (Exception e) {
            log.error("Error during old revoked refresh token cleanup", e);
        }
    }
}
