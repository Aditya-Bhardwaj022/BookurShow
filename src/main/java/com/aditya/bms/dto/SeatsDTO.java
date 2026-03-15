package com.aditya.bms.dto;

import com.aditya.bms.repository.ScreenRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatsDTO {
    private Long id;
    private String seatNumber;
    private String seatType;
    private Double basePrice;
}
