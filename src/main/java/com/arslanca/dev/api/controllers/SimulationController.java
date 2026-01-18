package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.SimulationService;
import com.arslanca.dev.business.requests.VerifySimulationRequest;
import com.arslanca.dev.business.responses.SimulationScenarioResponse;
import com.arslanca.dev.business.responses.VerificationResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
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