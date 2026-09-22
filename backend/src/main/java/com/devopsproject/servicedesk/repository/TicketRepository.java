package com.devopsproject.servicedesk.repository;

import com.devopsproject.servicedesk.model.Ticket;
import com.devopsproject.servicedesk.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t WHERE " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:category IS NULL OR t.category = :category)")
    List<Ticket> searchTickets(@Param("keyword") String keyword, 
                               @Param("status") TicketStatus status, 
                               @Param("category") String category);
}
