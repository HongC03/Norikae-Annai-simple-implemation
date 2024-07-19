package com.norikae.annai.helperClass;

import com.opencsv.bean.CsvBindByName;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class StationNode {

    @CsvBindByName(column = "station_name")
    private String stationName;

    @CsvBindByName(column = "station_name_jp")
    private String stationNameJp;

    @CsvBindByName(column = "longitude")
    private double longitude;

    @CsvBindByName(column = "latitude")
    private double latitude;

    // Edge
    private Map<String, StationNeighbor> neighbors;


    public void addNeighbor(StationNeighbor stationNeighbor) {
        if (neighbors == null) neighbors = new HashMap<>();
        this.neighbors.put(stationNeighbor.getDestinationStationName(), stationNeighbor);
    }

    public void addNeighbor(String destinationStationName, double distance, double travelTimeMinute) {
        if (neighbors == null) neighbors = new HashMap<>();
        StationNeighbor neighbor = new StationNeighbor(destinationStationName, distance, travelTimeMinute);
        this.neighbors.put(destinationStationName, neighbor);
    }

}
