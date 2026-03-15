package com.aditya.bms.repository;

import com.aditya.bms.model.Screen;
import com.aditya.bms.model.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show,Long>
{

List<Show> findByMovieId(Long movieId);
List<Show> findByScreenId(Long screenId);

List<Show> findByStartTimeBetween(LocalDateTime start,LocalDateTime end);
List<Show> findByMovie_IdAndScreen_Theatre_City(Long movieId,String city);

 

}
