package com.aditya.bms.controller;

import com.aditya.bms.dto.TheatreDTO;
import com.aditya.bms.service.theatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
public class TheaterController {

    @Autowired
    private final theatreService theatreService;

    public TheaterController(theatreService theatreService) {
        this.theatreService = theatreService;
    }

    @PostMapping
    public TheatreDTO createTheatre(@RequestBody TheatreDTO theatreDTO) {
        return theatreService.createTheatre(theatreDTO);
    }

    @GetMapping("/{id}")
    public TheatreDTO getTheatreById(@PathVariable Long id) {
        return theatreService.getTheatreById(id);
    }

    @GetMapping
    public List<TheatreDTO> getAllTheatres() {
        return theatreService.getAllTheatre();
    }

    @GetMapping("/city/{city}")
    public List<TheatreDTO> getTheatresByCity(@PathVariable String city) {
        return theatreService.getAllTheatreByCity(city);
    }

    @PutMapping("/{id}")
    public TheatreDTO updateTheatre(
            @PathVariable Long id,
            @RequestBody TheatreDTO theatreDTO) {

        return theatreService.updateTheatre(id, theatreDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteTheatre(@PathVariable Long id) {
        theatreService.deleteTheatre(id);
        return "Theatre deleted successfully";
    }
}
