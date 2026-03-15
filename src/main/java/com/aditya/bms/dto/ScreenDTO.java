package com.aditya.bms.dto;

import com.aditya.bms.model.Theatre;
import jakarta.persistence.criteria.CriteriaBuilder;
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
}
