package com.norikae.annai.controller;

import com.norikae.annai.cache.StationGraphCache;
import com.norikae.annai.helperClass.PathResult;
import com.norikae.annai.helperClass.StationNode;
import com.norikae.annai.service.StationGraphService;
import com.norikae.annai.type.NodeWeight;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(value = "http://localhost:5173")
public class NorikaeAnnaiController {

    private final StationGraphCache stationGraphCache;

    private final StationGraphService stationGraphService;

    public NorikaeAnnaiController(StationGraphCache stationGraphCache, StationGraphService stationGraphService) {
        this.stationGraphCache = stationGraphCache;
        this.stationGraphService = stationGraphService;
    }

    @GetMapping("/stations")
    public ResponseEntity<?> getAllStations() {
        Map<String, StationNode> stationNodeMap = stationGraphCache.getStationGraph().getStationNodeMap();
        return ResponseEntity.ok(stationNodeMap.values());
    }

    @GetMapping("/findShortestPath")
    public ResponseEntity<PathResult> findShortestPath(@RequestParam("from") String startStationName,
                                                       @RequestParam("to") String endStationName) throws Exception {
        PathResult pathResult = stationGraphService.findShortestPath(startStationName, endStationName, NodeWeight.TIME);
        return ResponseEntity.ok(pathResult);
    }


}
