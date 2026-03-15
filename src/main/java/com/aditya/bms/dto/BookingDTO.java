package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class BookingDTO {
   private Long id;
   private String bookingNumber;
   private LocalDateTime bookingTime;
   protected UserDTO user;
   private ShowDTO show;
   private PaymentDTO payment;
   private String status;
   private Double totalAmount;
   private List<ShowSeatDTO> seats;
}
