package com.arslanca.dev.dataAccess;

import com.arslanca.dev.entities.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<BlogPost, Integer> {
    boolean existsByTitle(String title);
}
