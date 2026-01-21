package com.arslanca.dev.business.concretes;


import com.arslanca.dev.business.abstracts.BlogService;
import com.arslanca.dev.business.requests.CreateBlogRequest;
import com.arslanca.dev.dataAccess.abstracts.BlogRepository;
import com.arslanca.dev.entities.BlogPost;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogManager implements BlogService {

    public final BlogRepository blogRepository;

    @Override
    public List<BlogPost> getAll() {
        return blogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdDate")); //tarihe göre sort etcek
    }

    @Override
    public void add(CreateBlogRequest request) {
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(request.getTitle());
        blogPost.setContent(request.getContent());
        blogRepository.save(blogPost);
    }

    @Override
    public void update(int id, CreateBlogRequest request) {
        BlogPost blogPost = blogRepository.findById(id).orElseThrow(); //hata yönetimini nası yapcam bilmiyom tam
        blogPost.setTitle(request.getTitle());
        blogPost.setContent(request.getContent());
        blogRepository.save(blogPost);
    }

    @Override
    public void delete(int id) {
        blogRepository.deleteById(id);
    }
}
