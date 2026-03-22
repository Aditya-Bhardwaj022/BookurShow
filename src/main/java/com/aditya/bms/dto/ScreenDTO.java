package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScreenDTO {
    private Long id;
    private String name;
    private Integer totalseats;
    private TheatreDTO theatre;
    private Integer seatsPerRow;
}
