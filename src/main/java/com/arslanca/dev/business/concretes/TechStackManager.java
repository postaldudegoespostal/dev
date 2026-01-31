package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.abstracts.TechStackService;
import com.arslanca.dev.business.dto.requests.CreateTechStackRequest;
import com.arslanca.dev.business.dto.responses.GetTechStackResponse;
import com.arslanca.dev.business.mappers.TechStackMapper;
import com.arslanca.dev.core.utilities.exceptions.types.BusinessException;
import com.arslanca.dev.dataAccess.TechStackRepository;
import com.arslanca.dev.entities.TechStack;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TechStackManager implements TechStackService {

    private final TechStackRepository techStackRepository;
    private final TechStackMapper techStackMapper;

    @Override
    public List<GetTechStackResponse> getAll() {
        List<TechStack> techStacks = techStackRepository.findAll();
        return techStackMapper.toResponseList(techStacks);
    }

    @Override
    public void add(CreateTechStackRequest request) {
        if (techStackRepository.existsByName(request.getName())) {
            throw new BusinessException("Bu başlıkta bir blog yazısı zaten mevcut: " + request.getName());
        }
        TechStack techStack = techStackMapper.toEntity(request);
        techStackRepository.save(techStack);
    }

    @Override
    public void delete(Integer id) {
        checkIfTechStackExists(id);
        techStackRepository.deleteById(id);
    }

    @Override
    public void update(Integer id, CreateTechStackRequest request) {
        TechStack techStack = techStackRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Tech stack bulunamadı (ID: " + id + ")"));

        techStackMapper.updateEntityFromRequest(request, techStack);
        techStackRepository.save(techStack);

    }

    private void checkIfTechStackExists(Integer id) {
        if (!techStackRepository.existsById(id)) {
            throw new BusinessException("Tech stack bulunamadı (ID: " + id + ")");
        }
    }
}
