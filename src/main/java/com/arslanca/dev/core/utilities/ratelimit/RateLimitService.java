package com.arslanca.dev.core.utilities.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String ipAddress) {
        return cache.computeIfAbsent(ipAddress, this::newBucket);
    }

    public Bucket resolveLoginBucket(String ipAddress) {
        return cache.computeIfAbsent("login:" + ipAddress, this::newLoginBucket);
    }

    private Bucket newLoginBucket(String apiKey) {
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(15)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private Bucket newBucket(String apiKey) {
        Bandwidth limit = Bandwidth.classic(3, Refill.greedy(3, Duration.ofHours(1)));

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
