package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.PinnedProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PinnedProjectRepository extends JpaRepository<PinnedProject, Long> {
    boolean existsByTitle(String title);
}
