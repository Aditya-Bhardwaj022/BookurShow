package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheatreDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private Integer totalScreens;
}
