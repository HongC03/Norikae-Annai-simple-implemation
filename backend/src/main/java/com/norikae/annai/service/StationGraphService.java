package com.norikae.annai.service;

import com.norikae.annai.cache.StationGraphCache;
import com.norikae.annai.helperClass.GraphNode;
import com.norikae.annai.helperClass.PathResult;
import com.norikae.annai.helperClass.StationNeighbor;
import com.norikae.annai.helperClass.StationNode;
import com.norikae.annai.type.NodeWeight;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Slf4j
@Service
public class StationGraphService {

    private final StationGraphCache stationGraphCache;

    public StationGraphService(StationGraphCache stationGraphCache) {
        this.stationGraphCache = stationGraphCache;
    }

    public PathResult findShortestPath(String startStationName, String endStationName, NodeWeight nodeWeight) throws Exception {
        Map<String, StationNode> stationNodeMap = stationGraphCache.getStationGraph().getStationNodeMap();
        if (CollectionUtils.isEmpty(stationNodeMap)) {
            throw new Exception();
        }

        if (!stationNodeMap.containsKey(startStationName)) {
            System.out.printf("%s is not exist%n", startStationName);
        }
        if (!stationNodeMap.containsKey(endStationName)) {
            System.out.printf("%s is not exist%n", endStationName);
        }

        StationNode startStationNode = stationNodeMap.get(startStationName);
        StationNode endStationNode = stationNodeMap.get(endStationName);

        PriorityQueue<GraphNode> nodePriorityQueue = new PriorityQueue<>(Comparator
                .comparingDouble(node -> {
                    switch (nodeWeight) {
                        case TIME -> { return node.getTravelTimeMinute(); }
                        case DISTANCE -> { return node.getDistanceKm(); }
                        default -> { return node.getTravelTimeMinute(); }
                    }
                }));
        nodePriorityQueue.add(new GraphNode(startStationNode, 0.0, 0.0)); // start at cost 0

        Map<String, GraphNode> graphNodeMap = new HashMap<>();
        for (StationNode stationNode: stationNodeMap.values()) {
            graphNodeMap.put(stationNode.getStationName(), new GraphNode(stationNode, Double.MAX_VALUE, Double.MAX_VALUE)); // initialize all station with MAX_VALUE first
        }
        graphNodeMap.put(startStationName, new GraphNode(startStationNode, 0.0, 0.0));

        Set<String> visitedStation = new HashSet<>();
        Map<StationNode, StationNode> successorMap = new HashMap<>();

        while (!nodePriorityQueue.isEmpty()) {
            GraphNode current = nodePriorityQueue.poll();
            StationNode currStationNode = current.getStationNode();
            visitedStation.add(currStationNode.getStationName());

            log.info(String.format("Processing station: %s", currStationNode.getStationName()));

            if (currStationNode.getStationName().equals(endStationNode.getStationName())) {
                log.info(String.format("Reached destination: %s", endStationNode.getStationName()));
                break;
            }

            for (Map.Entry<String, StationNeighbor> neighborEntry: currStationNode.getNeighbors().entrySet()) {
                String neighborName = neighborEntry.getKey();
                StationNode neighborStationNode = stationNodeMap.get(neighborName);
                GraphNode neighborGraphNode = graphNodeMap.get(neighborName);

                if (visitedStation.contains(neighborName)) continue; // prevent revisit

                double travelTimeMinute = neighborEntry.getValue().getTravelTimeMinutes();
                double totalTravelTimeMinutes = current.getTravelTimeMinute() + travelTimeMinute;

                double distanceKm = neighborEntry.getValue().getDistanceKm();
                double totalDistanceKm = current.getDistanceKm() + distanceKm;

                switch (nodeWeight) {
                    case TIME -> {
                        if (totalTravelTimeMinutes < neighborGraphNode.getTravelTimeMinute()) {
                            graphNodeMap.put(neighborName, new GraphNode(neighborStationNode, totalTravelTimeMinutes, totalDistanceKm));
                            successorMap.put(neighborStationNode, currStationNode);
                            nodePriorityQueue.add(new GraphNode(neighborStationNode, totalTravelTimeMinutes, totalDistanceKm));
                            log.info(String.format("Updating station to : %s, { totalTravelTimeMinutes: %s, totalDistanceKm: %s  }",
                                                    neighborStationNode.getStationName(),
                                                    totalTravelTimeMinutes,
                                                    totalDistanceKm));
                        }
                    }
                    case DISTANCE -> {
                        if (totalDistanceKm < neighborGraphNode.getDistanceKm()) {
                            graphNodeMap.put(neighborName, new GraphNode(neighborStationNode, totalTravelTimeMinutes, totalDistanceKm));
                            successorMap.put(neighborStationNode, currStationNode);
                            nodePriorityQueue.add(new GraphNode(neighborStationNode, totalTravelTimeMinutes, totalDistanceKm));
                            log.info(String.format("Updating station to : %s, { totalTravelTimeMinutes: %s, totalDistanceKm: %s  }",
                                    neighborStationNode.getStationName(),
                                    totalTravelTimeMinutes,
                                    totalDistanceKm));
                        }
                    }
                    default -> {
                        if (totalTravelTimeMinutes < neighborGraphNode.getTravelTimeMinute()) {
                            graphNodeMap.put(neighborName, new GraphNode(neighborStationNode, totalTravelTimeMinutes, totalDistanceKm));
                            successorMap.put(neighborStationNode, currStationNode);
                            nodePriorityQueue.add(new GraphNode(neighborStationNode, totalTravelTimeMinutes, totalDistanceKm));
                            log.info(String.format("Updating station to : %s, { totalTravelTimeMinutes: %s, totalDistanceKm: %s  }",
                                    neighborStationNode.getStationName(),
                                    totalTravelTimeMinutes,
                                    totalDistanceKm));
                        }
                    }
                }
            }
        }

        List<StationNode> path = new ArrayList<>();
        for (StationNode at = endStationNode; at != null; at = successorMap.get(at)) {
            path.add(at);
        }
        Collections.reverse(path);

        return new PathResult(
                path,
                graphNodeMap.get(endStationName).getTravelTimeMinute(),
                graphNodeMap.get(endStationName).getDistanceKm()
        );
    }

}
