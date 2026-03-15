package com.aditya.bms.service;

import com.aditya.bms.dto.MovieDTO;
import com.aditya.bms.exception.ResourceNotFoundException;
import com.aditya.bms.model.Movie;
import com.aditya.bms.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class movieService {
    @Autowired
    private MovieRepository movieRepository;

    public MovieDTO createMovie(MovieDTO movieDTO)
    {
        Movie movie=mapToEntity(movieDTO);
        Movie saveMovie=movieRepository.save(movie);
        return mapToDTO(saveMovie);

    }

    public MovieDTO getMovieById(Long id)
    {
        Movie movie=movieRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Movie not found with id : "+id));
        return mapToDTO(movie);
    }

    public List<MovieDTO> getAllMovies()
    {
        List<Movie> movies=movieRepository.findAll();
        return movies.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MovieDTO> getMovieByLanguage(String language)
    {
        List<Movie> movies=movieRepository.findByLanguage(language);
        return movies.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MovieDTO> getMovieByGenre(String genre)
    {
        List<Movie> movies=movieRepository.findByLanguage(genre);
        return movies.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MovieDTO> searchMovies(String title)
    {
        List<Movie> movies=movieRepository.findByLanguage(title);
        return movies.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public MovieDTO updateMovie(Long id,MovieDTO movieDto)
    {
        Movie movie=movieRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Movie not found with id : "+id));
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setLanguage(movieDto.getLanguage());
        movie.setGenre(movieDto.getGenre());
        movie.setDurationMins(movieDto.getDurationMins());
        movie.setReleaseDate(movieDto.getReleaseDate());
        movie.setPosterUrl(movieDto.getPosterUrl());

        Movie updatedMovie = movieRepository.save(movie);
        return mapToDTO(updatedMovie);
    }


    public void deleteMovie(Long id)
    {
        Movie movie=movieRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Movie not found with id : "+id));
        movieRepository.delete(movie);
    }

    private MovieDTO mapToDTO(Movie movie){

        MovieDTO movieDTO=new MovieDTO();
        movieDTO.setId(movie.getId());
        movieDTO.setTitle(movie.getTitle());
        movieDTO.setLanguage(movie.getLanguage());
        movieDTO.setDescription(movie.getDescription());
        movieDTO.setGenre(movie.getGenre());
        movieDTO.setDurationMins(movie.getDurationMins());
        movieDTO.setReleaseDate(movie.getReleaseDate());
        movieDTO.setPosterUrl(movie.getPosterUrl());
        return movieDTO;
        }

    public Movie mapToEntity(MovieDTO movieDTO)
    {
        Movie movie=new Movie();
        movie.setTitle(movieDTO.getTitle());
        movie.setDescription(movieDTO.getDescription());
        movie.setLanguage(movieDTO.getLanguage());
        movie.setGenre(movieDTO.getGenre());
        movie.setReleaseDate(movieDTO.getReleaseDate());
        movie.setPosterUrl(movieDTO.getPosterUrl());

    return movie;
    }
}
