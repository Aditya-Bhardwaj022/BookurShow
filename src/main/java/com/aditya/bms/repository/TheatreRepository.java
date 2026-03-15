     package com.aditya.bms.repository;

    import com.aditya.bms.model.ShowSeat;
    import com.aditya.bms.model.Theatre;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;

    import java.util.List;

     @Repository
     public interface TheatreRepository extends JpaRepository<Theatre,Long>
     {

         List<Theatre> findByCity(String city);

     }
