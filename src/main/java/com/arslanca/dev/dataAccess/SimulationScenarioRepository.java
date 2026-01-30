package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.concretes.SimulationScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SimulationScenarioRepository extends JpaRepository<SimulationScenario, String> {

    @Query(value = "SELECT * FROM simulation_scenarios ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<SimulationScenario> findRandomScenario();
}