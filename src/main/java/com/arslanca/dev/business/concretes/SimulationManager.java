package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.abstracts.SimulationService;
import com.arslanca.dev.business.requests.VerifySimulationRequest;
import com.arslanca.dev.business.responses.SimulationScenarioResponse;
import com.arslanca.dev.business.responses.VerificationResultResponse;
import com.arslanca.dev.dataAccess.abstracts.SimulationOptionRepository;
import com.arslanca.dev.dataAccess.abstracts.SimulationScenarioRepository;
import com.arslanca.dev.entities.SimulationOption;
import com.arslanca.dev.entities.SimulationScenario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimulationManager implements SimulationService {

    private final SimulationScenarioRepository scenarioRepository;
    private final SimulationOptionRepository optionRepository;

    @Override
    public SimulationScenarioResponse getRandomScenario() {
        SimulationScenario scenario = scenarioRepository.findRandomScenario()
                .orElseThrow(() -> new RuntimeException("No scenarios found in DB"));

        List<SimulationScenarioResponse.ScenarioOption> optionDTOs = scenario.getOptions().stream()
                .map(opt -> SimulationScenarioResponse.ScenarioOption.builder()
                        .id(opt.getId())
                        .title(opt.getTitle())
                        .description(opt.getDescription())
                        .build())
                .collect(Collectors.toList());

        return SimulationScenarioResponse.builder()
                .id(scenario.getId())
                .title(scenario.getTitle())
                .description(scenario.getDescription())
                .systemState(SimulationScenarioResponse.SystemState.builder()
                        .cpuLoad(scenario.getCpuLoad())
                        .latency(scenario.getLatency())
                        .memoryUsage(scenario.getMemoryUsage())
                        .build())
                .options(optionDTOs)
                .build();
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