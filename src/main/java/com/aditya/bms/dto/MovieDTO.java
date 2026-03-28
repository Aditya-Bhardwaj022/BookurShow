package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class MovieDTO {
    private Long id;
    private String title;
    private String description;
    private String language;
    private String genre;
    private Integer durationMins;
    private String releaseDate;
    private String posterUrl;

}
