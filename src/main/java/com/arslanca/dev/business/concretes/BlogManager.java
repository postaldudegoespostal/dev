package com.arslanca.dev.business.concretes;


import com.arslanca.dev.business.abstracts.BlogService;
import com.arslanca.dev.business.dto.requests.CreateBlogRequest;
import com.arslanca.dev.business.dto.responses.GetBlogResponse;
import com.arslanca.dev.business.mappers.BlogMapper;
import com.arslanca.dev.core.utilities.exceptions.types.BusinessException;
import com.arslanca.dev.core.utilities.exceptions.types.NotFoundException;
import com.arslanca.dev.dataAccess.BlogRepository;
import com.arslanca.dev.entities.BlogPost;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogManager implements BlogService {

    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;

    @Override
    public List<GetBlogResponse> getAll() {
        List<BlogPost> posts = blogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"));
        return posts.stream()
                .map(blogMapper::toResponse)
                .toList();
    }


    @Override
    public void add(CreateBlogRequest request) {
        if (blogRepository.existsByTitle(request.getTitle())) {
            throw new BusinessException("Bu başlıkta bir blog yazısı zaten mevcut: " + request.getTitle());
        }

        BlogPost blogPost = blogMapper.toBlogPost(request);
        blogPost.setCreatedDate(LocalDate.now());
        blogRepository.save(blogPost);
    }

    @Override
    public void update(int id, CreateBlogRequest request) {
        BlogPost blogPost = blogRepository.findById(id).orElseThrow(() -> new NotFoundException("Blog yazısı bulunamadı (ID: " + id + ")"));

        blogMapper.updateBlogPostFromRequest(request, blogPost);
        blogRepository.save(blogPost);
    }

    @Override
    public void delete(int id) {
        checkIfBlogExists(id);
        blogRepository.deleteById(id);
    }

    private void checkIfBlogExists(int id) {
        if (!blogRepository.existsById(id)) {
            throw new NotFoundException("Silinecek blog yazısı bulunamadı (ID: " + id + ")");
        }
    }
}
