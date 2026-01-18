package com.arslanca.dev.adapters.models;

import lombok.Data;
import java.util.List;

@Data
public class WakaTimeStatsResponse {
    private StatsData data;

    @Data
    public static class StatsData {
        private String human_readable_total;
        private String human_readable_daily_average;
        private List<ProjectStat> projects;
    }

    @Data
    public static class ProjectStat {
        private String name;
        private String text;
        private Double percent;
    }
}