package com.devopsproject.servicedesk.controller;

import com.devopsproject.servicedesk.dto.TicketUpdateDTO;
import com.devopsproject.servicedesk.model.Ticket;
import com.devopsproject.servicedesk.model.TicketStatus;
import com.devopsproject.servicedesk.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        Ticket createdTicket = ticketService.createTicket(ticket);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) String category) {
        
        List<Ticket> tickets = ticketService.searchTickets(keyword, status, category);
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        return new ResponseEntity<>(ticket, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketUpdateDTO ticketDetails) {
        Ticket updatedTicket = ticketService.updateTicket(id, ticketDetails);
        return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        
        if (!payload.containsKey("status")) {
            throw new IllegalArgumentException("Status is required");
        }
        
        TicketStatus newStatus;
        try {
            newStatus = TicketStatus.valueOf(payload.get("status"));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value");
        }
        
        String resolutionNotes = payload.get("resolutionNotes");
        
        Ticket updatedTicket = ticketService.updateTicketStatus(id, newStatus, resolutionNotes);
        return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
    }
}
