package com.aditya.bms.service;

import com.aditya.bms.dto.SeatsDTO;
import com.aditya.bms.dto.ShowSeatDTO;
import com.aditya.bms.exception.ResourceNotFoundException;
import com.aditya.bms.model.ShowSeat;
import com.aditya.bms.repository.ShowSeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class showSeatService {

    @Autowired
    private ShowSeatRepository showSeatRepository;

    public List<ShowSeatDTO> getSeatsByShow(Long showId) {

        List<ShowSeat> seats = showSeatRepository.findByShowId(showId);

        return seats.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ShowSeatDTO> getAvailableSeats(Long showId) {

        List<ShowSeat> seats =
                showSeatRepository.findByShowIdAndStatus(showId, "AVAILABLE");

        return seats.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ShowSeatDTO getSeatById(Long id) {

        ShowSeat seat = showSeatRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seat not found with id " + id));

        return mapToDTO(seat);
    }

    public ShowSeatDTO updateSeatStatus(Long id, String status) {

        ShowSeat seat = showSeatRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seat not found with id " + id));

        seat.setStatus(status);

        ShowSeat updatedSeat = showSeatRepository.save(seat);

        return mapToDTO(updatedSeat);
    }

    private ShowSeatDTO mapToDTO(ShowSeat seat) {

        SeatsDTO baseSeat = new SeatsDTO();
        baseSeat.setId(seat.getSeat().getId());
        baseSeat.setSeatNumber(seat.getSeat().getSeatNumber());
        baseSeat.setSeatType(seat.getSeat().getSeatType());
        baseSeat.setBasePrice(seat.getSeat().getBasePrice());

        return new ShowSeatDTO(
                seat.getId(),
                baseSeat,
                seat.getStatus(),
                seat.getPrice()
        );
    }
}

