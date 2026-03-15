package com.aditya.bms.controller;

import com.aditya.bms.dto.ShowSeatDTO;
import com.aditya.bms.service.showSeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/show-seats")
public class ShowSeatController {

    @Autowired
    private showSeatService showSeatService;

    @GetMapping("/show/{showId}")
    public List<ShowSeatDTO> getSeatsByShow(@PathVariable Long showId) {
        return showSeatService.getSeatsByShow(showId);
    }

    @GetMapping("/show/{showId}/available")
    public List<ShowSeatDTO> getAvailableSeats(@PathVariable Long showId) {
        return showSeatService.getAvailableSeats(showId);
    }

    @GetMapping("/{id}")
    public ShowSeatDTO getSeatById(@PathVariable Long id) {
        return showSeatService.getSeatById(id);
    }

    @PutMapping("/{id}/status")
    public ShowSeatDTO updateSeatStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return showSeatService.updateSeatStatus(id, status);
    }
}
