package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.RefreshToken;
import com.arslanca.dev.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);

    List<RefreshToken> findByUserAndRevoked(User user, boolean revoked);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate < :date")
    int deleteByExpiryDateBefore(@Param("date") Instant date);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.revoked = :revoked AND r.expiryDate < :date")

    int deleteByRevokedAndExpiryDateBefore(@Param("revoked") boolean revoked, @Param("date") Instant date);

    List<RefreshToken> findByUserAndRevokedOrderByExpiryDateDesc(User user, boolean revoked);
}
