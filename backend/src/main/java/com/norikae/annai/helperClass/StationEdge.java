package com.norikae.annai.helperClass;

import com.opencsv.bean.CsvBindByName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StationEdge {

    @CsvBindByName(column = "start_station")
    private String startStationName;

    @CsvBindByName(column = "end_station")
    private String endStationName;

    @CsvBindByName(column = "distance_km")
    private double distanceKm;

    private double travelTimeMinute;

    public void calculateTravelTimeMinute() {
        double averageSpeedKmH = 80.0;
        double averageStationWaitTime = 0.5;
        this.travelTimeMinute = (distanceKm / averageSpeedKmH) * 60 + averageStationWaitTime;
    }

}