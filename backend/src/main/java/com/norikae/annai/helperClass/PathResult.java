package com.norikae.annai.helperClass;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PathResult {

    List<StationNode> path;

    double totalTravelTimeMinute;

    double totalDistanceKm;

}
