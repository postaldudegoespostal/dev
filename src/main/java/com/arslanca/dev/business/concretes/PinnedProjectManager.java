package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.abstracts.PinnedProjectService;
import com.arslanca.dev.business.dto.requests.CreatePinnedProjectRequest;
import com.arslanca.dev.business.dto.requests.UpdatePinnedProjectRequest;
import com.arslanca.dev.business.dto.responses.PinnedProjectResponse;
import com.arslanca.dev.business.mappers.PinnedProjectMapper;
import com.arslanca.dev.core.utilities.exceptions.types.BusinessException;
import com.arslanca.dev.core.utilities.exceptions.types.NotFoundException;
import com.arslanca.dev.dataAccess.PinnedProjectRepository;
import com.arslanca.dev.entities.PinnedProject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PinnedProjectManager implements PinnedProjectService {

    private final PinnedProjectRepository repository;
    private final PinnedProjectMapper mapper;

    @Override
    public List<PinnedProjectResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void add(CreatePinnedProjectRequest request) {
        if (repository.existsByTitle(request.getTitle())) {
            throw new BusinessException("Bu başlıkta bir proje zaten mevcut: " + request.getTitle());
        }
        PinnedProject project = mapper.toEntity(request);
        repository.save(project);
    }

    @Override
    public void update(Long id, UpdatePinnedProjectRequest request) {
        PinnedProject project = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Proje bulunamadı (ID: " + id + ")"));

        // Title check if title is changed
        if (!project.getTitle().equalsIgnoreCase(request.getTitle()) && repository.existsByTitle(request.getTitle())) {
            throw new BusinessException("Girdiğiniz yeni başlık başka bir projede kullanılıyor: " + request.getTitle());
        }

        mapper.updateEntityFromRequest(request, project);
        repository.save(project);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Silinecek proje bulunamadı (ID: " + id + ")");
        }
        repository.deleteById(id);
    }
}
