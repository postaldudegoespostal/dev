package com.arslanca.dev.business.concretes;

import com.arslanca.dev.business.dto.requests.CreateBlogRequest;
import com.arslanca.dev.business.dto.responses.GetBlogResponse;
import com.arslanca.dev.business.mappers.BlogMapper;
import com.arslanca.dev.dataAccess.BlogRepository;
import com.arslanca.dev.entities.concretes.BlogPost;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class BlogManagerTest {

    private BlogManager blogManager;

    private BlogRepository blogRepository;
    private BlogMapper blogMapper;

    @BeforeEach
    void setUp() {
        blogRepository = org.mockito.Mockito.mock(BlogRepository.class);
        blogMapper = org.mockito.Mockito.mock(BlogMapper.class);
        blogManager = new BlogManager(blogRepository, blogMapper);
    }

    @Test
    void getAll_shouldReturnListOfGetBlogResponse() {
        BlogPost blogPost = new BlogPost();
        blogPost.setId(1);
        blogPost.setTitle("Test Title");

        List<BlogPost> blogList = List.of(blogPost);
        org.springframework.data.domain.Page<BlogPost> blogPage = new org.springframework.data.domain.PageImpl<>(blogList);

        GetBlogResponse response = new GetBlogResponse();
        response.setId(1);
        response.setTitle("Test Title");

        Mockito.when(blogRepository.findAll(Mockito.any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(blogPage);

        Mockito.when(blogMapper.toResponse(blogPost)).thenReturn(response);

        org.springframework.data.domain.Page<GetBlogResponse> result = blogManager.getAll(0, 5);

        assertEquals(1, result.getContent().size());
        assertEquals("Test Title", result.getContent().get(0).getTitle());

        Mockito.verify(blogRepository, Mockito.times(1)).findAll(Mockito.any(org.springframework.data.domain.Pageable.class));
    }


    @Test
    void add_shouldSaveBlog_whenTitleDoesNotExist() {
        CreateBlogRequest request = new CreateBlogRequest();
        request.setTitle("Unique Title");

        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(request.getTitle());

        Mockito.when(blogRepository.existsByTitle(request.getTitle())).thenReturn(false);
        Mockito.when(blogMapper.toBlogPost(request)).thenReturn(blogPost);

        blogManager.add(request);

        Mockito.verify(blogRepository, Mockito.times(1)).save(blogPost);
    }

    @Test
    void add_shouldThrowException_whenTitleExists() {
        CreateBlogRequest request = new CreateBlogRequest();
        request.setTitle("Duplicate Title");

        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(request.getTitle());

        Mockito.when(blogRepository.existsByTitle(request.getTitle())).thenReturn(true);
         assertThrows(RuntimeException.class, () -> blogManager.add(request));

        Mockito.verify(blogRepository, Mockito.never()).save(blogPost);
    }



    @Test
    void update_shouldUpdateBlog_whenBlogIdExists() {
        BlogPost existingBlogPost = new BlogPost();
        existingBlogPost.setId(1);
        existingBlogPost.setTitle("Old Title");
        CreateBlogRequest request = new CreateBlogRequest();
        request.setTitle("Updated Title");

        Mockito.when(blogRepository.findById(1)).thenReturn(java.util.Optional.of(existingBlogPost));

        blogManager.update(1, request);

        Mockito.verify(blogMapper, Mockito.times(1)).updateBlogPostFromRequest(request, existingBlogPost);
        Mockito.verify(blogRepository, Mockito.times(1)).save(existingBlogPost);
    }

    @Test
    void update_shouldThrowException_whenBlogIdDoesNotExist() {
        CreateBlogRequest request = new CreateBlogRequest();
        request.setTitle("Updated Title");

        Mockito.when(blogRepository.findById(1)).thenReturn(java.util.Optional.empty());

        assertThrows(RuntimeException.class, () -> blogManager.update(1, request));

        Mockito.verify(blogMapper, Mockito.never()).updateBlogPostFromRequest(Mockito.any(), Mockito.any());
        Mockito.verify(blogRepository, Mockito.never()).save(Mockito.any());
    }


    @Test
    void delete_shouldDeleteBlogPost_whenBlogPostIdExists() {
        Mockito.when(blogRepository.existsById(1)).thenReturn(true);

        blogManager.delete(1);

        Mockito.verify(blogRepository, Mockito.times(1)).deleteById(1);
    }

    @Test
    void delete_shouldThrowException_whenBlogPostIdDoesNotExist() {
        Mockito.when(blogRepository.existsById(1)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> blogManager.delete(1));

        Mockito.verify(blogRepository, Mockito.never()).deleteById(1);
    }

}