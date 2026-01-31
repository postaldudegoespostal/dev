package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.dto.requests.CreateTechStackRequest;
import com.arslanca.dev.business.dto.responses.GetTechStackResponse;

import java.util.List;

public interface TechStackService {
    List<GetTechStackResponse> getAll();
    void add(CreateTechStackRequest request);
    void delete(Integer id);
    void update(Integer id, CreateTechStackRequest request);
}
