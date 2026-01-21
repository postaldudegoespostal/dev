package com.arslanca.dev.business.abstracts;

import com.arslanca.dev.business.requests.CreateBlogRequest;
import com.arslanca.dev.entities.BlogPost;

import java.util.List;

public interface BlogService {
    List<BlogPost> getAll();
    void add(CreateBlogRequest request);
    void update(int id, CreateBlogRequest request);
    void delete(int id);


}
