package com.arslanca.dev.dataAccess.abstracts;

import com.arslanca.dev.entities.SimulationOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimulationOptionRepository extends JpaRepository<SimulationOption, String> {
}