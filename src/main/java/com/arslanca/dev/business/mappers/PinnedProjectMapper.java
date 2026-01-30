package com.arslanca.dev.business.mappers;

import com.arslanca.dev.business.dto.requests.CreatePinnedProjectRequest;
import com.arslanca.dev.business.dto.requests.UpdatePinnedProjectRequest;
import com.arslanca.dev.business.dto.responses.PinnedProjectResponse;
import com.arslanca.dev.entities.concretes.PinnedProject;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PinnedProjectMapper {
    PinnedProject toEntity(CreatePinnedProjectRequest request);
    PinnedProjectResponse toResponse(PinnedProject project);
    void updateEntityFromRequest(UpdatePinnedProjectRequest request, @MappingTarget PinnedProject project);
}
