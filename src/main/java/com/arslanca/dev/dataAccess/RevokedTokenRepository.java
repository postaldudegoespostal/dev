package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Integer> {
    Optional<RevokedToken> findByToken(String token);
    @Modifying
    @Query("DELETE FROM RevokedToken r WHERE r.expiryDate < :date")
    int deleteByExpiryDateBefore(@Param("date") Instant date);
}
