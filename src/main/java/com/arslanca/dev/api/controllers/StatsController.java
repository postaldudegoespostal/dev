package com.arslanca.dev.api.controllers;


import com.arslanca.dev.adapters.WakaTimeAdapter;
import com.arslanca.dev.business.responses.StatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats/")
@RequiredArgsConstructor
public class StatsController {

    private final WakaTimeAdapter wakaTimeAdapter;

    @GetMapping("/current")
    public StatsResponse getCurrentStatus() {
        return wakaTimeAdapter.getCurrentStatus();
    }
}
