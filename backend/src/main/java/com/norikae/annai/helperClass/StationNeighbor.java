package com.norikae.annai.helperClass;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StationNeighbor {

    private String destinationStationName;

    private double distanceKm;

    private double travelTimeMinutes;

    public StationNeighbor(String destinationStationName, double distanceKm, double travelTimeMinutes) {
        this.destinationStationName = destinationStationName;
        this.distanceKm = distanceKm;
        this.travelTimeMinutes = travelTimeMinutes;
    }
}
