package com.aditya.bms.controller;

import com.aditya.bms.dto.ScreenDTO;
import com.aditya.bms.service.screenService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/screens")
public class ScreenController {

    private final screenService screenService;

    public ScreenController(screenService screenService) {
        this.screenService = screenService;
    }

    @PostMapping
    public ScreenDTO createScreen(@RequestBody ScreenDTO screenDTO) {
        return screenService.createScreen(screenDTO);
    }

    @GetMapping("/{id}")
    public ScreenDTO getScreenById(@PathVariable Long id) {
        return screenService.getScreenById(id);
    }

    @GetMapping
    public List<ScreenDTO> getAllScreens() {
        return screenService.getAllScreens();
    }
}
