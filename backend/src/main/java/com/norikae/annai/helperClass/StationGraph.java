package com.norikae.annai.helperClass;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class StationGraph {

    // Vertex
    private Map<String, StationNode> stationNodeMap;

    public StationGraph() {
        this.stationNodeMap = new HashMap<>();
    }

    public void addStationNode(StationNode stationNode) {
        this.stationNodeMap.put(stationNode.getStationName(), stationNode);
    }

    public void putAllStationNode(Map<String, StationNode> src) {
        this.stationNodeMap.putAll(src);
    }


}
