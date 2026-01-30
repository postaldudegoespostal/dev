package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.dto.requests.CreatePinnedProjectRequest;
import com.arslanca.dev.business.dto.requests.UpdatePinnedProjectRequest;
import com.arslanca.dev.business.dto.responses.PinnedProjectResponse;
import com.arslanca.dev.business.mappers.PinnedProjectMapper;
import com.arslanca.dev.dataAccess.PinnedProjectRepository;
import com.arslanca.dev.entities.concretes.PinnedProject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class PinnedProjectManagerTest {

    private PinnedProjectManager pinnedProjectManager;
    private PinnedProjectRepository pinnedProjectRepository;
    private PinnedProjectMapper pinnedProjectMapper;

    @BeforeEach
    void setUp() {
        pinnedProjectRepository = org.mockito.Mockito.mock(PinnedProjectRepository.class);
        pinnedProjectMapper = org.mockito.Mockito.mock(PinnedProjectMapper.class);
        pinnedProjectManager = new PinnedProjectManager(pinnedProjectRepository, pinnedProjectMapper);
    }

    @Test
    void getAll_shouldReturnListOfPinnedProjectResponse() {
        PinnedProject pinnedProject = new PinnedProject();
        pinnedProject.setId(1L);
        pinnedProject.setTitle("Test Project");

        List<PinnedProject> pinnedProjectList = List.of(pinnedProject);
        PinnedProjectResponse response = new PinnedProjectResponse();
        response.setId(1L);
        response.setTitle("Test Project");

        org.mockito.Mockito.when(pinnedProjectRepository.findAll())
                .thenReturn(pinnedProjectList);
        org.mockito.Mockito.when(pinnedProjectMapper.toResponse(pinnedProject)).thenReturn(response);

        List<PinnedProjectResponse> result = pinnedProjectManager.getAll();
        assertEquals(1, result.size());
        assertEquals("Test Project", result.get(0).getTitle());

        org.mockito.Mockito.verify(pinnedProjectRepository, org.mockito.Mockito.times(1)).findAll();
    }

    @Test
    void getAll_shouldReturnEmptyListWhenNoPinnedProjects() {
        org.mockito.Mockito.when(pinnedProjectRepository.findAll())
                .thenReturn(List.of());

        List<PinnedProjectResponse> result = pinnedProjectManager.getAll();
        assertTrue(result.isEmpty());

        org.mockito.Mockito.verify(pinnedProjectRepository, org.mockito.Mockito.times(1)).findAll();
    }

    @Test
    void add_shouldSavePinnedProject_whenTitleDoesNotExist() {
        CreatePinnedProjectRequest request = new CreatePinnedProjectRequest();
        request.setTitle("Unique Project");
        PinnedProject pinnedProject = new PinnedProject();
        pinnedProject.setTitle(request.getTitle());

        org.mockito.Mockito.when(pinnedProjectRepository.existsByTitle(request.getTitle())).thenReturn(false);
        org.mockito.Mockito.when(pinnedProjectMapper.toEntity(request)).thenReturn(pinnedProject);
        pinnedProjectManager.add(request);

        org.mockito.Mockito.verify(pinnedProjectRepository, org.mockito.Mockito.times(1)).save(pinnedProject);
    }

    @Test
    void add_shouldThrowException_whenTitleExists() {
        CreatePinnedProjectRequest request = new CreatePinnedProjectRequest();
        request.setTitle("Duplicate Project");

        org.mockito.Mockito.when(pinnedProjectRepository.existsByTitle(request.getTitle())).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            pinnedProjectManager.add(request);
        });

        String expectedMessage = "Bu başlıkta bir proje zaten mevcut: " + request.getTitle();
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
        org.mockito.Mockito.verify(pinnedProjectRepository, org.mockito.Mockito.never()).save(org.mockito.Mockito.any(PinnedProject.class));
    }

    @Test
    void update_shouldUpdatePinnedProject_whenIdExists() {
        Long id = 1L;
        PinnedProject alreadyExists = new PinnedProject();
        alreadyExists.setId(id);
        alreadyExists.setTitle("Old Title");

        UpdatePinnedProjectRequest request = new UpdatePinnedProjectRequest();
        request.setTitle("Updated Title");

        Mockito.when(pinnedProjectRepository.findById(id)).thenReturn(Optional.of(alreadyExists));
        Mockito.when(pinnedProjectRepository.existsByTitle("Updated Title")).thenReturn(false);

        pinnedProjectManager.update(id, request);

        Mockito.verify(pinnedProjectMapper, Mockito.times(1))
                .updateEntityFromRequest(request, alreadyExists);

        Mockito.verify(pinnedProjectRepository, Mockito.times(1)).save(alreadyExists);
    }

    @Test
    void update_shouldThrowException_whenIdDoesNotExist() {
        Long id = 1L;
        UpdatePinnedProjectRequest request = new UpdatePinnedProjectRequest();
        request.setTitle("Updated Title");

        Mockito.when(pinnedProjectRepository.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            pinnedProjectManager.update(id, request);
        });

        String expectedMessage = "Proje bulunamadı (ID: " + id + ")";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
        Mockito.verify(pinnedProjectRepository, Mockito.never()).save(Mockito.any(PinnedProject.class));
    }

    @Test
    void delete_shouldDeletePinnedProject_whenIdExists() {
        Long id = 1L;
        Mockito.when(pinnedProjectRepository.existsById(id)).thenReturn(true);
        pinnedProjectManager.delete(id);
        Mockito.verify(pinnedProjectRepository, Mockito.times(1)).deleteById(id);
    }

    @Test
    void delete_shouldThrowException_whenIdDoesNotExist() {
        Long id = 1L;
        Mockito.when(pinnedProjectRepository.existsById(id)).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            pinnedProjectManager.delete(id);
        });

        String expectedMessage = "Silinecek proje bulunamadı (ID: " + id + ")";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
        Mockito.verify(pinnedProjectRepository, Mockito.never()).deleteById(id);
    }

}