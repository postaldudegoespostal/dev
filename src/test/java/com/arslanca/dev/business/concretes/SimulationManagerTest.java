package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.dto.responses.SimulationScenarioResponse;
import com.arslanca.dev.business.mappers.SimulationMapper;
import com.arslanca.dev.dataAccess.SimulationOptionRepository;
import com.arslanca.dev.dataAccess.SimulationScenarioRepository;
import com.arslanca.dev.entities.concretes.SimulationOption;
import com.arslanca.dev.entities.concretes.SimulationScenario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SimulationManagerTest {

    private SimulationManager simulationManager;
    private  SimulationScenarioRepository scenarioRepository;
    private  SimulationOptionRepository optionRepository;
    private  SimulationMapper simulationMapper;

    @BeforeEach
    void setUp() {
        scenarioRepository = org.mockito.Mockito.mock(SimulationScenarioRepository.class);
        optionRepository = org.mockito.Mockito.mock(SimulationOptionRepository.class);
        simulationMapper = org.mockito.Mockito.mock(SimulationMapper.class);
        simulationManager = new SimulationManager(scenarioRepository, optionRepository, simulationMapper);
    }

    @Test
    void getRandomScenario_shouldReturnScenarioResponse_whenScenarioExists() {
        //Arrange
        SimulationScenario scenario = new SimulationScenario();
        scenario.setId("scenario-123");
        scenario.setTitle("High CPU Load Scenario");
        scenario.setDescription("Server is burning!");
        scenario.setCpuLoad(95);
        scenario.setLatency(500);
        scenario.setMemoryUsage(85);

        //Mock Response oluşturuyoruz
        SimulationScenarioResponse.SystemState expectedState = SimulationScenarioResponse.SystemState.builder()
                .cpuLoad(95)
                .latency(500)
                .memoryUsage(85)
                .build();

        SimulationScenarioResponse expectedResponse = SimulationScenarioResponse.builder()
                .id("scenario-123")
                .title("High CPU Load Scenario")
                .description("Server is burning!")
                .systemState(expectedState)
                .options(List.of(
                        SimulationScenarioResponse.ScenarioOption.builder().id("opt-1").title("Senior Solution").build()
                ))
                .build();

        // Mock davranışlarını tanımlıyoruz
        Mockito.when(scenarioRepository.findRandomScenario()).thenReturn(Optional.of(scenario));
        Mockito.when(simulationMapper.toResponse(scenario)).thenReturn(expectedResponse);

        // Act stage - testi gerçekleştiriyoruz
        SimulationScenarioResponse result = simulationManager.getRandomScenario();

        // Assert stage - sonuçları doğruluyoruz
        assertNotNull(result, "Dönen sonuç null olmamalı!");
        assertEquals("scenario-123", result.getId());
        assertEquals("High CPU Load Scenario", result.getTitle());

        // SystemState kontrolü
        assertNotNull(result.getSystemState(), "SystemState maplenememiş!");
        assertEquals(95, result.getSystemState().getCpuLoad());
        assertEquals(500, result.getSystemState().getLatency());

        // Options kontrolü
        assertFalse(result.getOptions().isEmpty(), "Seçenekler listesi boş gelmemeli!");
        assertEquals(1, result.getOptions().size());

        // Verification - Mock metodlarının çağrıldığını doğrula
        Mockito.verify(scenarioRepository, Mockito.times(1)).findRandomScenario();

        // konsol çıktısı
        System.out.println("sonuc   ---->   " + result);
    }

    @Test
    void getRandomScenario_shouldThrowException_whenNoScenarioExists() {
        Mockito.when(scenarioRepository.findRandomScenario()).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            simulationManager.getRandomScenario();
        });

        assertEquals("No scenarios found in DB", exception.getMessage());

        Mockito.verify(scenarioRepository, Mockito.times(1)).findRandomScenario();
        Mockito.verifyNoInteractions(simulationMapper);
        System.out.println("Exception mesajı: " + exception.getMessage());
    }

    @Test
    void verifyResult_shouldReturnCorrectResponseBasedOnOptionType() {
        SimulationOption seniorOption = new SimulationOption();
        seniorOption.setId("opt-senior");
        seniorOption.setType(SimulationOption.OptionType.SENIOR_SOLUTION);

        SimulationOption midOption = new SimulationOption();
        midOption.setId("opt-mid");
        midOption.setType(SimulationOption.OptionType.MID_SOLUTION);

        SimulationOption juniorOption = new SimulationOption();
        juniorOption.setId("opt-junior");
        juniorOption.setType(SimulationOption.OptionType.JUNIOR_FAIL);

        Mockito.when(optionRepository.findById("opt-senior")).thenReturn(Optional.of(seniorOption));
        Mockito.when(optionRepository.findById("opt-mid")).thenReturn(Optional.of(midOption));
        Mockito.when(optionRepository.findById("opt-junior")).thenReturn(Optional.of(juniorOption));

        var seniorRequest = new com.arslanca.dev.business.dto.requests.VerifySimulationRequest();
        seniorRequest.setSelectedOptionId("opt-senior");
        var seniorResponse = simulationManager.verifyResult(seniorRequest);

        assertTrue(seniorResponse.isSuccess());
        assertEquals("SENIOR", seniorResponse.getUserLevel());
        assertEquals("System Optimized. Latency dropped to 12ms. Welcome, Architect.", seniorResponse.getMessage());
        assertEquals("GOD_MODE", seniorResponse.getRedirectPath());
        System.out.println("Senior Response: " + seniorResponse);

        var midRequest = new com.arslanca.dev.business.dto.requests.VerifySimulationRequest();
        midRequest.setSelectedOptionId("opt-mid");
        var midResponse = simulationManager.verifyResult(midRequest);
        assertFalse(midResponse.isSuccess());
        assertEquals("MID", midResponse.getUserLevel());
        assertEquals("Crisis averted, but costs are too high.", midResponse.getMessage());
        assertEquals("STANDARD_MODE", midResponse.getRedirectPath());
        System.out.println("Mid Response: " + midResponse);

        var juniorRequest = new com.arslanca.dev.business.dto.requests.VerifySimulationRequest();
        juniorRequest.setSelectedOptionId("opt-junior");
        var juniorResponse = simulationManager.verifyResult(juniorRequest);
        assertFalse(juniorResponse.isSuccess());
        assertEquals("JUNIOR", juniorResponse.getUserLevel());
        assertEquals("The server crashed.", juniorResponse.getMessage());
        assertEquals("LEARNING_MODE", juniorResponse.getRedirectPath());
        System.out.println("Junior Response: " + juniorResponse);

        Mockito.verify(optionRepository, Mockito.times(1)).findById("opt-senior");
        Mockito.verify(optionRepository, Mockito.times(1)).findById("opt-mid");
        Mockito.verify(optionRepository, Mockito.times(1)).findById("opt-junior");
    }
}