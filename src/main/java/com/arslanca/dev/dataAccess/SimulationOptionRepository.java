package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.concretes.SimulationOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimulationOptionRepository extends JpaRepository<SimulationOption, String> {
}