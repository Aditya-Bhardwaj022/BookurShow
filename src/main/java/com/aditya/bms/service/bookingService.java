package com.aditya.bms.service;

import com.aditya.bms.dto.*;
import com.aditya.bms.exception.ResourceNotFoundException;
import com.aditya.bms.exception.SeatUnavailableException;
import com.aditya.bms.model.*;
import com.aditya.bms.repository.BookingRepository;
import com.aditya.bms.repository.ShowRepository;
import com.aditya.bms.repository.ShowSeatRepository;
import com.aditya.bms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class bookingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private ShowSeatRepository showSeatRepository;

    @Autowired
    private BookingRepository bookingRepository;


    @Transactional
    public BookingDTO createBooking(BookingRequestDTO bookingRequest) {

        User user = userRepository.findById(bookingRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        Show show = showRepository.findById(bookingRequest.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show Not Found"));

        List<ShowSeat> selectedSeats = showSeatRepository.findAllById(bookingRequest.getSeatIds());

        for (ShowSeat seat : selectedSeats) {
            if (!"AVAILABLE".equals(seat.getStatus())) {
                throw new SeatUnavailableException(
                        "Seat " + seat.getSeat().getSeatNumber() + " is not available");
            }
            seat.setStatus("LOCKED");
        }

        showSeatRepository.saveAll(selectedSeats);

        Double totalAmount = selectedSeats.stream()
                .mapToDouble(ShowSeat::getPrice)
                .sum();

        // Payment
        Payment payment = new Payment();
        payment.setAmount(totalAmount);
        payment.setPaymentTime(LocalDateTime.now());
        payment.setPaymentMethod(bookingRequest.getPaymentMethod());
        payment.setStatus("SUCCESS");
        payment.setTransactionId(UUID.randomUUID().toString());

        // Booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        booking.setTotalAmount(totalAmount);
        booking.setBookingNumber(UUID.randomUUID().toString());
        booking.setPayment(payment);

        Booking savedBooking = bookingRepository.save(booking);

        selectedSeats.forEach(seat -> {
            seat.setStatus("BOOKED");
            seat.setBooking(savedBooking);
        });

        showSeatRepository.saveAll(selectedSeats);

        return mapToBookingDTO(savedBooking, selectedSeats);
    }


    public BookingDTO getBookingById(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not Found"));

        List<ShowSeat> seats = showSeatRepository.findAll()
                .stream()
                .filter(seat -> seat.getBooking() != null &&
                        seat.getBooking().getId().equals(booking.getId()))
                .collect(Collectors.toList());

        return mapToBookingDTO(booking, seats);
    }


    @Transactional
    public BookingDTO cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not Found"));

        booking.setStatus("CANCELLED");

        List<ShowSeat> seats = showSeatRepository.findAll()
                .stream()
                .filter(seat -> seat.getBooking() != null &&
                        seat.getBooking().getId().equals(booking.getId()))
                .collect(Collectors.toList());

        seats.forEach(seat -> {
            seat.setStatus("AVAILABLE");
            seat.setBooking(null);
        });

        if (booking.getPayment() != null) {
            booking.getPayment().setStatus("REFUNDED");
        }

        Booking updatedBooking = bookingRepository.save(booking);
        showSeatRepository.saveAll(seats);

        return mapToBookingDTO(updatedBooking, seats);
    }


    private BookingDTO mapToBookingDTO(Booking booking, List<ShowSeat> seats) {

        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setBookingNumber(booking.getBookingNumber());
        bookingDTO.setBookingTime(booking.getBookingTime());
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setTotalAmount(booking.getTotalAmount());

        // User
        UserDTO userDTO = new UserDTO();
        userDTO.setId(booking.getUser().getId());
        userDTO.setName(booking.getUser().getName());
        userDTO.setEmail(booking.getUser().getEmail());
        userDTO.setPhoneNumber(booking.getUser().getPhoneNumber());
        bookingDTO.setUser(userDTO);

        // Show
        ShowDTO showDTO = new ShowDTO();
        showDTO.setId(booking.getShow().getId());
        showDTO.setStartTime(booking.getShow().getStartTime());

        // Movie
        MovieDTO movieDTO = new MovieDTO();
        movieDTO.setId(booking.getShow().getMovie().getId());
        movieDTO.setTitle(booking.getShow().getMovie().getTitle());
        movieDTO.setDescription(booking.getShow().getMovie().getDescription());
        movieDTO.setLanguage(booking.getShow().getMovie().getLanguage());
        movieDTO.setGenre(booking.getShow().getMovie().getGenre());
        movieDTO.setDurationMins(booking.getShow().getMovie().getDurationMins());
        movieDTO.setReleaseDate(booking.getShow().getMovie().getReleaseDate());
        movieDTO.setPosterUrl(booking.getShow().getMovie().getPosterUrl());

        showDTO.setMovie(movieDTO);

        // Screen
        ScreenDTO screenDTO = new ScreenDTO();
        screenDTO.setId(booking.getShow().getScreen().getId());
        screenDTO.setName(booking.getShow().getScreen().getName());
        screenDTO.setTotalseats(booking.getShow().getScreen().getTotalSeats());

        // Theatre
        TheatreDTO theatreDTO = new TheatreDTO();
        theatreDTO.setId(booking.getShow().getScreen().getTheatre().getId());
        theatreDTO.setName(booking.getShow().getScreen().getTheatre().getName());
        theatreDTO.setAddress(booking.getShow().getScreen().getTheatre().getAddress());
        theatreDTO.setCity(booking.getShow().getScreen().getTheatre().getCity());
        theatreDTO.setTotalScreens(booking.getShow().getScreen().getTheatre().getTotalScreen());

        screenDTO.setTheatre(theatreDTO);
        showDTO.setScreen(screenDTO);
        bookingDTO.setShow(showDTO);

        // Seats
        List<ShowSeatDTO> seatDtos = seats.stream()
                .map(seat -> {
                    ShowSeatDTO seatDto = new ShowSeatDTO();
                    seatDto.setId(seat.getId());
                    seatDto.setStatus(seat.getStatus());
                    seatDto.setPrice(seat.getPrice());

                    SeatsDTO baseSeat = new SeatsDTO();
                    baseSeat.setId(seat.getSeat().getId());
                    baseSeat.setSeatNumber(seat.getSeat().getSeatNumber());
                    baseSeat.setSeatType(seat.getSeat().getSeatType());
                    baseSeat.setBasePrice(seat.getSeat().getBasePrice());

                    seatDto.setSeat(baseSeat);
                    return seatDto;
                })
                .collect(Collectors.toList());

        bookingDTO.setSeats(seatDtos);

        // Payment
        if (booking.getPayment() != null) {
            PaymentDTO paymentDTO = new PaymentDTO();
            paymentDTO.setId(booking.getPayment().getId());
            paymentDTO.setAmount(booking.getPayment().getAmount());
            paymentDTO.setPaymentMethod(booking.getPayment().getPaymentMethod());
            paymentDTO.setPaymentTime(booking.getPayment().getPaymentTime());
            paymentDTO.setStatus(booking.getPayment().getStatus());
            paymentDTO.setTransactionId(booking.getPayment().getTransactionId());

            bookingDTO.setPayment(paymentDTO);
        }

        return bookingDTO;
    }
}
