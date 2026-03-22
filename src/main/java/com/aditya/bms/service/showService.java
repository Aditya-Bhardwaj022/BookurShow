    package com.aditya.bms.service;

    import com.aditya.bms.dto.*;
    import com.aditya.bms.exception.ResourceNotFoundException;
    import com.aditya.bms.model.Movie;
    import com.aditya.bms.model.Screen;
    import com.aditya.bms.model.Show;
    import com.aditya.bms.model.ShowSeat;
    import com.aditya.bms.repository.MovieRepository;
    import com.aditya.bms.repository.ScreenRepository;
    import com.aditya.bms.repository.ShowRepository;
    import com.aditya.bms.repository.ShowSeatRepository;
    import org.hibernate.engine.spi.Resolution;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    public class showService {

        @Autowired
        private MovieRepository movieRepository;

        @Autowired
        private ScreenRepository screenRepository;

        @Autowired
        private ShowRepository showRepository;

        @Autowired
        private ShowSeatRepository showSeatRepository;


        public ShowDTO createShow(ShowDTO showDTO)
        {
            Show show=new Show();
            Movie movie= movieRepository.findById(showDTO.getMovie().getId()).
                    orElseThrow(()-> new ResourceNotFoundException("Movie Not Found"));
            Screen screen=screenRepository.findById(showDTO.getScreen().getId()).
                    orElseThrow(()-> new ResourceNotFoundException("Screen Not Found"));

            show.setMovie(movie);
            show.setScreen(screen);
            show.setStartTime(showDTO.getStartTime());
            show.setEndTime(showDTO.getEndTime());

            Show savedShow=showRepository.save(show);

            List<ShowSeat> availableSeat=
                    showSeatRepository.findByShowIdAndStatus(savedShow.getId(),"AVAILABLE");

            return mapToDTO(savedShow,availableSeat);
        }

        public ShowDTO getShowById(Long id)
        {
            Show show=showRepository.findById(id)
                    .orElseThrow(()->new ResourceNotFoundException("Show not found  with id: "+id));
            List<ShowSeat> availableSeats=
                    showSeatRepository.findByShowIdAndStatus(show.getId(),"AVAILABLE");
            return mapToDTO(show,availableSeats);
        }

        public List<ShowDTO> getAllShows()
        {
            List<Show> shows=showRepository.findAll();
            return shows.stream()
                    .map(show -> {
                        List<ShowSeat> availableSeats = showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                        return mapToDTO(show,availableSeats);
                    })
                    .collect(Collectors.toList());
        }

        public List<ShowDTO> getShowsByMovie(Long movieId)
        {
            List<Show> shows=showRepository.findByMovieId(movieId);
            return shows.stream()
                    .map(show -> {
                        List<ShowSeat> availableSeats = showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                        return mapToDTO(show,availableSeats);
                    })
                    .collect(Collectors.toList());
        }

        public List<ShowDTO> getShowsByMovieAndCity(Long movieId,String city)
        {
            List<Show> shows=showRepository.findByMovie_IdAndScreen_Theatre_City(movieId,city);
            return shows.stream()
                    .map(show -> {
                        List<ShowSeat> availableSeats = showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                        return mapToDTO(show,availableSeats);
                    })
                    .collect(Collectors.toList());
        }

        public List<ShowDTO> getShowsByDateRange(LocalDateTime startDate, LocalDateTime endDate)
        {
            List<Show> shows=showRepository.findByStartTimeBetween(startDate,endDate);
            return shows.stream()
                    .map(show -> {
                        List<ShowSeat> availableSeats = showSeatRepository.findByShowIdAndStatus(show.getId(), "AVAILABLE");
                        return mapToDTO(show,availableSeats);
                    })
                    .collect(Collectors.toList());
        }
        private ShowDTO mapToDTO(Show show,List<ShowSeat> availableSeats) {
            ShowDTO showDto = new ShowDTO();
            showDto.setId(show.getId());
            showDto.setStartTime(show.getStartTime());
            showDto.setEndTime(show.getEndTime());

            showDto.setMovie(new MovieDTO(
                    show.getMovie().getId(),
                    show.getMovie().getTitle(),
                    show.getMovie().getDescription(),
                    show.getMovie().getLanguage(),
                    show.getMovie().getGenre(),
                    show.getMovie().getDurationMins(),
                    show.getMovie().getReleaseDate(),
                    show.getMovie().getPosterUrl()
            ));

            TheatreDTO theaterDto = new TheatreDTO(
                    show.getScreen().getTheatre().getId(),
                    show.getScreen().getTheatre().getName(),
                    show.getScreen().getTheatre().getAddress(),
                    show.getScreen().getTheatre().getCity(),
                    show.getScreen().getTheatre().getTotalScreen()
            );

            showDto.setScreen(new ScreenDTO(
                    show.getScreen().getId(),
                    show.getScreen().getName(),
                    show.getScreen().getTotalSeats(),
                    theaterDto,
                    show.getScreen().getSeatsPerRow()
            ));

            List<ShowSeatDTO> seatDtos = availableSeats.stream()
                    .map(seat -> {
                        ShowSeatDTO seatDto = new ShowSeatDTO();
                        seatDto.setId(seat.getId());
                        seatDto.setStatus(seat.getStatus());
                        seatDto.setPrice(seat.getPrice());

                        SeatsDTO baseSeatDto = new SeatsDTO();
                        baseSeatDto.setId(seat.getSeat().getId());
                        baseSeatDto.setSeatNumber(seat.getSeat().getSeatNumber());
                        baseSeatDto.setSeatType(seat.getSeat().getSeatType());
                        baseSeatDto.setBasePrice(seat.getSeat().getBasePrice());
                        seatDto.setSeat(baseSeatDto);
                        return seatDto;
                    })
                    .collect(Collectors.toList());

            showDto.setAvailableSeats(seatDtos);
            return showDto;
        }
    }
