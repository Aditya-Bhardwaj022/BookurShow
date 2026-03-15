package com.aditya.bms.service;

import com.aditya.bms.dto.TheatreDTO;
import com.aditya.bms.exception.ResourceNotFoundException;
import com.aditya.bms.model.Theatre;
import com.aditya.bms.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class theatreService {

    @Autowired
    private TheatreRepository theatreRepository;

    public TheatreDTO createTheatre(TheatreDTO theatreDTO)
    {
        Theatre theatre=mapToEntity(theatreDTO);
        Theatre savedTheatre=theatreRepository.save(theatre);
        return mapToDTO(savedTheatre);
    }

    public TheatreDTO getTheatreById(Long id)
    {
        Theatre theatre=theatreRepository.findById(id).
                orElseThrow(()-> new ResourceNotFoundException("Theater not found with id: "+id));
        return mapToDTO(theatre);
    }

    public List<TheatreDTO> getAllTheatre()
    {
        List<Theatre> theatres=theatreRepository.findAll();
        return theatres.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TheatreDTO> getAllTheatreByCity(String city)
    {
        List<Theatre> theatres=theatreRepository.findByCity(city);
        return theatres.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TheatreDTO updateTheatre(Long id, TheatreDTO theatreDTO)
    {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found with id: " + id));
        theatre.setName(theatreDTO.getName());
        theatre.setAddress(theatreDTO.getAddress());
        theatre.setCity(theatreDTO.getCity());
        theatre.setTotalScreen(theatreDTO.getTotalScreens());
        Theatre updatedTheatre = theatreRepository.save(theatre);
        return mapToDTO(updatedTheatre);
    }

    public void deleteTheatre(Long id)
    {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found with id: " + id));

        theatreRepository.delete(theatre);
    }



    private TheatreDTO mapToDTO(Theatre theatre)
    {
        TheatreDTO theatreDTO=new TheatreDTO();
        theatreDTO.setId(theatre.getId());
        theatreDTO.setName(theatre.getName());
        theatreDTO.setCity(theatre.getCity());
        theatreDTO.setAddress(theatre.getAddress());
        theatreDTO.setTotalScreens(theatre.getTotalScreen());
        return theatreDTO;
    }



    private Theatre mapToEntity(TheatreDTO theatreDTO)
    {
        Theatre theatre=new Theatre();
        theatre.setName(theatreDTO.getName());
        theatre.setAddress(theatreDTO.getAddress());
        theatre.setCity(theatreDTO.getCity());
        theatre.setTotalScreen(theatreDTO.getTotalScreens());
        return theatre;
    }
}
