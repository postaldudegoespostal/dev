package com.arslanca.dev.api.controllers;

import com.arslanca.dev.business.abstracts.TechStackService;
import com.arslanca.dev.business.dto.requests.CreatePinnedProjectRequest;
import com.arslanca.dev.business.dto.requests.CreateTechStackRequest;
import com.arslanca.dev.business.dto.responses.GetTechStackResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/techstacks") // Ana giriş kapısı
@RequiredArgsConstructor
public class TechStackController {

    private final TechStackService techStackService;

    @GetMapping
    public List<GetTechStackResponse> getAll() {
        return techStackService.getAll();
    }

    @PostMapping("/admin")
    public ResponseEntity<Void> add(@RequestBody @Valid CreateTechStackRequest request) {
        techStackService.add(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        techStackService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Void> update(@PathVariable Integer id, @RequestBody @Valid CreateTechStackRequest request) {
        techStackService.update(id, request);
        return ResponseEntity.ok().build();
    }
}