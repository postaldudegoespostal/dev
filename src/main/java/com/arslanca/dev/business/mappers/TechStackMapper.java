package com.arslanca.dev.business.mappers;

import com.arslanca.dev.business.dto.requests.CreateTechStackRequest;
import com.arslanca.dev.business.dto.responses.GetTechStackResponse;
import com.arslanca.dev.entities.TechStack;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TechStackMapper {
    //request to entity
    TechStack toEntity(CreateTechStackRequest request);

    //entity to response
    GetTechStackResponse toResponse(TechStack techStack);

    //get list of responses -> frontend
    List<GetTechStackResponse> toResponseList(List<TechStack> techStacks);

    void updateEntityFromRequest(CreateTechStackRequest request, @org.mapstruct.MappingTarget TechStack techStack);

}
