package com.arslanca.dev.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "simulation_options")
public class SimulationOption {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private OptionType type;

    @ManyToOne
    @JoinColumn(name = "scenario_id")
    private SimulationScenario scenario;

    public enum OptionType {
        SENIOR_SOLUTION,
        MID_SOLUTION,
        JUNIOR_FAIL
    }
}