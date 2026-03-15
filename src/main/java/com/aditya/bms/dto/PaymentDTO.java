package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private String transactionId;
    private Double amount;
    private LocalDateTime paymentTime;
    private String paymentMethod;
    private String status;
}
