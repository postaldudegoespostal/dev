package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.TechStack;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechStackRepository extends JpaRepository<TechStack, Integer> {
    boolean existsByName(String name);
}
