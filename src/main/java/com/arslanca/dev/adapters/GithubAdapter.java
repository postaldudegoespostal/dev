package com.arslanca.dev.adapters;

import com.arslanca.dev.business.responses.GithubRepoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GithubAdapter {

    private final RestClient.Builder restClientBuilder;

    private final String GITHUB_USERNAME = "postaldudegoespostal"; //hardcoded oldu bura da yapcak bişe yok şuan

    @Cacheable(value = "github-repos")
    public List<GithubRepoResponse> getRepos(){
        RestClient restClient = restClientBuilder.baseUrl("https://api.github.com").build();
        return restClient.get()
                .uri("/users/" + GITHUB_USERNAME + "/repos?sort=updated&direction=desc") //günceli üste al
                .retrieve()
                .body(new ParameterizedTypeReference<List<GithubRepoResponse>>() {});
    }


}
