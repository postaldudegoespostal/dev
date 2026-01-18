package com.arslanca.dev.adapters;

import com.arslanca.dev.adapters.models.WakaTimeResponse;
import com.arslanca.dev.adapters.models.WakaTimeStatsResponse;
import com.arslanca.dev.business.responses.StatsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
public class WakaTimeAdapter {

    @Value("${WAKA_KEY}")
    private String apiKey;

    private final String BASE_URL = "https://wakatime.com/api/v1/users/current";
    private final RestTemplate restTemplate = new RestTemplate();

    @Cacheable(value = "status-waka")
    @Scheduled(fixedRate = 600000)
    public StatsResponse getCurrentStatus() {
        String statsUrl = BASE_URL + "/stats/all_time?api_key=" + apiKey;
        String heartbeatsUrl = BASE_URL + "/heartbeats?date=today&api_key=" + apiKey;

        try {
            WakaTimeResponse hbResponse = restTemplate.getForObject(heartbeatsUrl, WakaTimeResponse.class);
            WakaTimeStatsResponse statsResponse = restTemplate.getForObject(statsUrl, WakaTimeStatsResponse.class);

            var responseBuilder = StatsResponse.builder();
            String currentProjectName = null;

            if (hbResponse != null && hbResponse.getData() != null && !hbResponse.getData().isEmpty()) {
                var lastHeartbeat = hbResponse.getData().get(hbResponse.getData().size() - 1);

                double currentTimeSeconds = System.currentTimeMillis() / 1000.0;
                boolean isActive = (currentTimeSeconds - lastHeartbeat.getTime()) < 600;

                currentProjectName = lastHeartbeat.getProject();

                responseBuilder
                        .isCodingNow(isActive)
                        .ideName(lastHeartbeat.getEditor())
                        .projectName(currentProjectName)
                        .currentlyEditingFile(formatFileName(lastHeartbeat.getEntity()))
                        .lastActiveTime(convertTime(lastHeartbeat.getTime()));
            } else {
                responseBuilder.isCodingNow(false);
            }

            if (statsResponse != null && statsResponse.getData() != null) {

                responseBuilder.totalSpentOnAllProjects(statsResponse.getData().getHuman_readable_total());

                if (currentProjectName != null && statsResponse.getData().getProjects() != null) {
                    String finalCurrentProjectName = currentProjectName;

                    Optional<WakaTimeStatsResponse.ProjectStat> projectStat = statsResponse.getData().getProjects().stream()
                            .filter(p -> p.getName().equalsIgnoreCase(finalCurrentProjectName))
                            .findFirst();

                    if (projectStat.isPresent()) {
                        responseBuilder.totalSpentOnCurrentProject(projectStat.get().getText());
                    } else {
                        responseBuilder.totalSpentOnCurrentProject("Just started");
                    }
                }
            }

            return responseBuilder.build();

        } catch (Exception e) {
            System.err.println("WakaTime API Hatası: " + e.getMessage());
            return StatsResponse.builder().isCodingNow(false).build();
        }
    }

    private String formatFileName(String fullPath) {
        if (fullPath == null) return "Unknown";
        int lastSlash = fullPath.lastIndexOf("/");
        if (lastSlash == -1) lastSlash = fullPath.lastIndexOf("\\");
        return lastSlash != -1 ? fullPath.substring(lastSlash + 1) : fullPath;
    }

    private String convertTime(Double timestamp) {
        Date date = new Date((long) (timestamp * 1000));
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        return sdf.format(date);
    }
}