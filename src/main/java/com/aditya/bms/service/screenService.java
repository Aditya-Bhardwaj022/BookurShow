package com.aditya.bms.service;

import com.aditya.bms.dto.ScreenDTO;
import com.aditya.bms.dto.TheatreDTO;
import com.aditya.bms.exception.ResourceNotFoundException;
import com.aditya.bms.model.Screen;
import com.aditya.bms.model.Seat;
import com.aditya.bms.model.Theatre;
import com.aditya.bms.repository.ScreenRepository;
import com.aditya.bms.repository.TheatreRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class screenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;

    public screenService(ScreenRepository screenRepository,
                         TheatreRepository theatreRepository) {
        this.screenRepository = screenRepository;
        this.theatreRepository = theatreRepository;
    }

    public ScreenDTO createScreen(ScreenDTO screenDTO) {

        Theatre theatre = theatreRepository.findById(screenDTO.getTheatre().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));

        // 🔥 Validation
        if (screenDTO.getTotalseats() % screenDTO.getSeatsPerRow() != 0) {
            throw new RuntimeException("Total seats must be divisible by seats per row");
        }

        Screen screen = new Screen();
        screen.setName(screenDTO.getName());
        screen.setTotalSeats(screenDTO.getTotalseats());
        screen.setSeatsPerRow(screenDTO.getSeatsPerRow());
        screen.setTheatre(theatre);

        // --- Automate Seat Generation ---
        Integer totalSeats = screenDTO.getTotalseats();
        Integer perRow = screenDTO.getSeatsPerRow();
        
        if (totalSeats != null && perRow != null) {
            List<Seat> seatsList = new ArrayList<>();
            for (int i = 0; i < totalSeats; i++) {
                char row = (char) ('A' + (i / perRow));
                int col = (i % perRow) + 1;
                
                Seat seat = new Seat();
                seat.setSeatNumber(String.valueOf(row) + col);
                seat.setSeatType("SILVER");
                seat.setBasePrice(100.0);
                seat.setScreen(screen);
                seatsList.add(seat);
            }
            screen.setSeats(seatsList);
        }

        Screen saved = screenRepository.save(screen);
        return mapToDTO(saved);
    }

    public ScreenDTO getScreenById(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found"));
        return mapToDTO(screen);
    }

    public List<ScreenDTO> getAllScreens() {
        List<Screen> screens = screenRepository.findAll();
        
        // --- SELF-HEALING: Repair any screens with 0 seats ---
        for (Screen screen : screens) {
            if (screen.getSeats() == null || screen.getSeats().isEmpty()) {
                repairScreen(screen);
            }
        }
        
        return screens.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void repairScreen(Screen screen) {
        Integer totalSeats = screen.getTotalSeats();
        Integer perRow = screen.getSeatsPerRow();
        
        if (totalSeats != null && perRow != null && totalSeats > 0 && perRow > 0) {
            List<Seat> seatsList = new ArrayList<>();
            for (int i = 0; i < totalSeats; i++) {
                char row = (char) ('A' + (i / perRow));
                int col = (i % perRow) + 1;
                
                Seat seat = new Seat();
                seat.setSeatNumber(String.valueOf(row) + col);
                seat.setSeatType("SILVER");
                seat.setBasePrice(100.0);
                seat.setScreen(screen);
                seatsList.add(seat);
            }
            screen.setSeats(seatsList);
            screenRepository.save(screen);
        }
    }

    private ScreenDTO mapToDTO(Screen screen) {

        Theatre theatre = screen.getTheatre();

        TheatreDTO theatreDTO = new TheatreDTO(
                theatre.getId(),
                theatre.getName(),
                theatre.getAddress(),
                theatre.getCity(),
                theatre.getTotalScreen()
        );

        return new ScreenDTO(
                screen.getId(),
                screen.getName(),
                screen.getTotalSeats(),
                theatreDTO,
                screen.getSeatsPerRow()
        );
    }
}