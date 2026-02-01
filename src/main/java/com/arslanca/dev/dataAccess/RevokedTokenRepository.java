package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Integer> {
    Optional<RevokedToken> findByToken(String token);
}
