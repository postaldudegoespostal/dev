package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.SimulationService;
import com.arslanca.dev.business.dto.requests.VerifySimulationRequest;
import com.arslanca.dev.business.dto.responses.SimulationScenarioResponse;
import com.arslanca.dev.business.dto.responses.VerificationResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.feature.simulation-enabled", havingValue = "true")
public class SimulationController {

    private final SimulationService simulationService;

    @GetMapping("/random")
    public SimulationScenarioResponse getRandomScenario() {
        return simulationService.getRandomScenario();
    }

    @PostMapping("/verify")
    public VerificationResultResponse verifyResult(@RequestBody VerifySimulationRequest request) {
        return simulationService.verifyResult(request);
    }
}