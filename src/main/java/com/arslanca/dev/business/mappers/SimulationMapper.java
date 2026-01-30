package com.arslanca.dev.business.mappers;

import com.arslanca.dev.business.dto.responses.SimulationScenarioResponse;
import com.arslanca.dev.entities.concretes.SimulationOption;
import com.arslanca.dev.entities.concretes.SimulationScenario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SimulationMapper {

    @Mapping(source = ".", target = "systemState")
    SimulationScenarioResponse toResponse(SimulationScenario scenario);

    SimulationScenarioResponse.SystemState toSystemState(SimulationScenario scenario);

    SimulationScenarioResponse.ScenarioOption toScenarioOption(SimulationOption option);
}
