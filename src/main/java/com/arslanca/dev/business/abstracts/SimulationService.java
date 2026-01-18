package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.requests.VerifySimulationRequest;
import com.arslanca.dev.business.responses.SimulationScenarioResponse;
import com.arslanca.dev.business.responses.VerificationResultResponse;

public interface SimulationService {
    SimulationScenarioResponse getRandomScenario();
    VerificationResultResponse verifyResult(VerifySimulationRequest request);
}
