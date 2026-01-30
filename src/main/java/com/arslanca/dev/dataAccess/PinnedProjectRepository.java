package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.concretes.PinnedProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PinnedProjectRepository extends JpaRepository<PinnedProject, Long> {
    boolean existsByTitle(String title);
}
