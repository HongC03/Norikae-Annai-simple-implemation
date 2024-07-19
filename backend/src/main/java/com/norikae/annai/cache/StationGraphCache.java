package com.norikae.annai.cache;

import com.norikae.annai.helperClass.StationEdge;
import com.norikae.annai.helperClass.StationGraph;
import com.norikae.annai.helperClass.StationNode;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Getter
public class StationGraphCache {

    private final StationGraph stationGraph = new StationGraph();

    @PostConstruct
    public void init() {
        Map<String, StationNode> stationNodeMap = getStationNodeMapWithNeighbors(
                List.of("src/main/resources/static/yamanote/yamanote_stations.csv",
                        "src/main/resources/static/chuo_rapid/chuo_rapid_stations.csv"
//                        "src/main/resources/static/sobu_rapid/sobu_rapid_stations.csv"
                ),
                List.of("src/main/resources/static/yamanote/yamanote_edges.csv",
                        "src/main/resources/static/chuo_rapid/chuo_rapid_edges.csv"
//                        "src/main/resources/static/sobu_rapid/sobu_rapid_edges.csv"
                )
        );

        stationGraph.putAllStationNode(stationNodeMap);
    }

    private List<StationEdge> readCsvToStationEdgeList(String filePath) {
        try (FileReader reader = new FileReader(filePath, StandardCharsets.UTF_8)) {
            CsvToBean<StationEdge> csvToBean = new CsvToBeanBuilder<StationEdge>(reader)
                    .withType(StationEdge.class)
                    .withType(StationEdge.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            List<StationEdge> stationEdges = csvToBean.parse();

            for (StationEdge stationEdge: stationEdges) {
                stationEdge.calculateTravelTimeMinute();
            }
            return stationEdges;
        } catch (IOException e) {
            log.info(String.format("IO operation is failed: %s", filePath));
            return Collections.emptyList();
        }
    }

    private Map<String, StationNode> readCsvToStationNodeMap(String filePath) {
        try (FileReader reader = new FileReader(filePath, StandardCharsets.UTF_8)) {
            CsvToBean<StationNode> csvToBean = new CsvToBeanBuilder<StationNode>(reader)
                    .withType(StationNode.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            List<StationNode> list = csvToBean.parse();
            return list.stream().collect(Collectors.toMap(StationNode::getStationName, stationNode -> stationNode));
        } catch (IOException e) {
            log.info(String.format("IO operation is failed: %s", filePath));
            return Collections.emptyMap();
        }
    }

    private Map<String, StationNode> getStationNodeMapWithNeighbors(List<String> stationNodeSrcPathList, List<String> stationEdgeSrcPathList) {
        Map<String, StationNode> stationNodeMap = new HashMap<>();
        for (String stationNodeSrcPath: stationNodeSrcPathList) {
            Map<String, StationNode> currStationNodeMap = readCsvToStationNodeMap(stationNodeSrcPath);
            stationNodeMap.putAll(currStationNodeMap);
        }

        List<StationEdge> stationEdgeList = new ArrayList<>();
        for (String stationEdgeSrcPath: stationEdgeSrcPathList) {
            List<StationEdge> currStationEdgeList = readCsvToStationEdgeList(stationEdgeSrcPath);
            stationEdgeList.addAll(currStationEdgeList);
        }

        for (StationEdge stationEdge: stationEdgeList) {
            String startStationName = stationEdge.getStartStationName();
            String endStationName = stationEdge.getEndStationName();
            double distanceKm = stationEdge.getDistanceKm();
            double travelTimeMinute = stationEdge.getTravelTimeMinute();

            StationNode startStationNode = stationNodeMap.get(startStationName);
            StationNode endStationNode = stationNodeMap.get(endStationName);

            if (startStationNode != null) {
                startStationNode.addNeighbor(endStationName, distanceKm, travelTimeMinute);
            } else {
                log.error("Can't find start station node by stationName: " + startStationName);
            }

            if (endStationNode != null) {
                endStationNode.addNeighbor(startStationName, distanceKm, travelTimeMinute);
            } else {
                log.error("Can't find end station node by stationName: " + endStationName);
            }
        }

        return stationNodeMap;
    }

}
