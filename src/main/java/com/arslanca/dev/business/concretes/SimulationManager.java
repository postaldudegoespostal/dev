package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.abstracts.SimulationService;
import com.arslanca.dev.business.dto.requests.VerifySimulationRequest;
import com.arslanca.dev.business.dto.responses.SimulationScenarioResponse;
import com.arslanca.dev.business.dto.responses.VerificationResultResponse;
import com.arslanca.dev.business.mappers.SimulationMapper;
import com.arslanca.dev.dataAccess.SimulationOptionRepository;
import com.arslanca.dev.dataAccess.SimulationScenarioRepository;
import com.arslanca.dev.entities.concretes.SimulationOption;
import com.arslanca.dev.entities.concretes.SimulationScenario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SimulationManager implements SimulationService {

    private final SimulationScenarioRepository scenarioRepository;
    private final SimulationOptionRepository optionRepository;
    private final SimulationMapper simulationMapper;

    @Override
    public SimulationScenarioResponse getRandomScenario() {
        SimulationScenario scenario = scenarioRepository.findRandomScenario()
                .orElseThrow(() -> new RuntimeException("No scenarios found in DB"));

        return simulationMapper.toResponse(scenario);
    }

    @Override
    public VerificationResultResponse verifyResult(VerifySimulationRequest request) {
        SimulationOption selectedOption = optionRepository.findById(request.getSelectedOptionId())
                .orElseThrow(() -> new RuntimeException("Option not found"));

        if (selectedOption.getType() == SimulationOption.OptionType.SENIOR_SOLUTION) {
            return VerificationResultResponse.builder()
                    .success(true)
                    .userLevel("SENIOR")
                    .message("System Optimized. Latency dropped to 12ms. Welcome, Architect.")
                    .redirectPath("GOD_MODE")
                    .build();
        } else if (selectedOption.getType() == SimulationOption.OptionType.MID_SOLUTION) {
            return VerificationResultResponse.builder()
                    .success(false)
                    .userLevel("MID")
                    .message("Crisis averted, but costs are too high.")
                    .redirectPath("STANDARD_MODE")
                    .build();
        } else {
            return VerificationResultResponse.builder()
                    .success(false)
                    .userLevel("JUNIOR")
                    .message("The server crashed.")
                    .redirectPath("LEARNING_MODE")
                    .build();
        }
    }
}