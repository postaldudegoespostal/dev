package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.RefreshToken;
import com.arslanca.dev.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
