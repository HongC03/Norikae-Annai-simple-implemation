package com.norikae.annai.helperClass;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GraphNode {

    private StationNode stationNode;

    private double travelTimeMinute;

    private double distanceKm;

}
