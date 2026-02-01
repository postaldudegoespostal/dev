package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.dto.requests.CreateTechStackRequest;
import com.arslanca.dev.business.dto.responses.GetTechStackResponse;
import com.arslanca.dev.business.mappers.TechStackMapper;
import com.arslanca.dev.dataAccess.TechStackRepository;
import com.arslanca.dev.entities.TechStack;
import com.arslanca.dev.entities.enums.StackLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TechStackManagerTest {

    private TechStackManager techStackManager;
    private TechStackRepository techStackRepository;
    private TechStackMapper techStackMapper;

    @BeforeEach
    void setUp() {
        techStackRepository = org.mockito.Mockito.mock(TechStackRepository.class);
        techStackMapper = org.mockito.Mockito.mock(TechStackMapper.class);
        techStackManager = new TechStackManager(techStackRepository, techStackMapper);
    }

    @Test
    void getAll_shouldReturnTheListOfTechStacks_whenTechStacksExist() {
        TechStack techStack1 = new TechStack();
        techStack1.setId(1);
        techStack1.setName("Java");
        techStack1.setType(StackLevel.CURRENT);

        TechStack techStack2 = new TechStack();
        techStack2.setId(2);
        techStack2.setName("Python");
        techStack2.setType(StackLevel.ADVANCING);

        List<TechStack> techStackList = List.of(techStack1, techStack2);

        GetTechStackResponse response1 = new GetTechStackResponse();
        response1.setId(1);
        response1.setName("Java");
        response1.setType("CURRENT");

        GetTechStackResponse response2 = new GetTechStackResponse();
        response2.setId(2);
        response2.setName("Python");
        response2.setType("ADVANCING");

        List<GetTechStackResponse> responseList = List.of(response1, response2);

        org.mockito.Mockito.when(techStackRepository.findAll()).thenReturn(techStackList);
        org.mockito.Mockito.when(techStackMapper.toResponseList(techStackList)).thenReturn(responseList);

        List<GetTechStackResponse> result = techStackManager.getAll();

        assertEquals(2, result.size());
        assertEquals("Java", result.get(0).getName());
        assertEquals("Python", result.get(1).getName());

        org.mockito.Mockito.verify(techStackRepository, org.mockito.Mockito.times(1)).findAll();
        org.mockito.Mockito.verify(techStackMapper, org.mockito.Mockito.times(1)).toResponseList(techStackList);

    }

    @Test
    void getAll_shouldReturnEmptyList_whenNoTechStacksExist() {
        List<TechStack> techStackList = List.of();

        org.mockito.Mockito.when(techStackRepository.findAll()).thenReturn(techStackList);
        org.mockito.Mockito.when(techStackMapper.toResponseList(techStackList)).thenReturn(List.of());

        List<GetTechStackResponse> result = techStackManager.getAll();

        assertTrue(result.isEmpty());

        org.mockito.Mockito.verify(techStackRepository, org.mockito.Mockito.times(1)).findAll();
        org.mockito.Mockito.verify(techStackMapper, org.mockito.Mockito.times(1)).toResponseList(techStackList);
    }

    @Test
    void add_shouldAddTechStack_whenTitleDoesNotExist() {
        CreateTechStackRequest request = new CreateTechStackRequest();
        request.setName("JavaScript");
        request.setType("CURRENT");
        TechStack techStack = new TechStack();
        techStack.setName(request.getName());
        techStack.setType(StackLevel.valueOf(request.getType()));
        org.mockito.Mockito.when(techStackRepository.existsByName(request.getName())).thenReturn(false);
        org.mockito.Mockito.when(techStackMapper.toEntity(request)).thenReturn(techStack);
        techStackManager.add(request);
        org.mockito.Mockito.verify(techStackRepository, org.mockito.Mockito.times(1)).save(
                techStack
        );
    }

    @Test
    void add_shouldThrowException_whenTitleExists() {
        CreateTechStackRequest request = new CreateTechStackRequest();
        request.setName("JavaScript");
        request.setType("CURRENT");

        org.mockito.Mockito.when(techStackRepository.existsByName(request.getName())).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            techStackManager.add(request);
        });

        String expectedMessage = "Bu başlıkta bir blog yazısı zaten mevcut: " + request.getName();
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));

        org.mockito.Mockito.verify(techStackRepository, org.mockito.Mockito.never()).save(
                org.mockito.Mockito.any(TechStack.class)
        );
    }

    @Test
    void delete_shouldDeleteTechStack_whenTechStackExists() {
        Integer techStackId = 1;
        org.mockito.Mockito.when(techStackRepository.existsById(techStackId)).thenReturn(true);
        techStackManager.delete(techStackId);
        org.mockito.Mockito.verify(techStackRepository, org.mockito.Mockito.times(1)).deleteById(techStackId);
    }

    @Test
    void delete_shouldThrowException_whenTechStackDoesNotExist() {
        Integer techStackId = 1;
        org.mockito.Mockito.when(techStackRepository.existsById(techStackId)).thenReturn(false);
        Exception exception = assertThrows(RuntimeException.class, () -> {
            techStackManager.delete(techStackId);
        });
        String expectedMessage = "Tech stack bulunamadı (ID: " + techStackId + ")";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
        org.mockito.Mockito.verify(techStackRepository, org.mockito.Mockito.never()).deleteById(techStackId);
    }

}