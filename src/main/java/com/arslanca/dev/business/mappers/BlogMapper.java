package com.arslanca.dev.business.mappers;

import com.arslanca.dev.business.dto.requests.CreateBlogRequest;
import com.arslanca.dev.business.dto.responses.GetBlogResponse;
import com.arslanca.dev.entities.concretes.BlogPost;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BlogMapper {

    BlogPost toBlogPost(CreateBlogRequest request);
    GetBlogResponse toResponse(BlogPost blogPost);
    void updateBlogPostFromRequest(CreateBlogRequest request, @MappingTarget BlogPost blogPost);
}
