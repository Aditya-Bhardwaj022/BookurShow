package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private MovieDTO movie;
    private ScreenDTO screen;
    private List<ShowSeatDTO> availableSeats;

}
