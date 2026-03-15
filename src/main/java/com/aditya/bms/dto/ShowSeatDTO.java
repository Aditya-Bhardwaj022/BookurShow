package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowSeatDTO {
    private Long id;
    private SeatsDTO seat;
    private String status;
    private Double price;
}
