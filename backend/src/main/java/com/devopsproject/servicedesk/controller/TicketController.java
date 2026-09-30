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
import java.util.stream.Collectors;
import org.springframework.security.core.context.SecurityContextHolder;
import com.devopsproject.servicedesk.security.UserDetailsImpl;

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
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ticket.setCreatedBy(currentUser.getId());
        Ticket createdTicket = ticketService.createTicket(ticket);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) String category) {
        
        List<Ticket> tickets = ticketService.searchTickets(keyword, status, category);

        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdminOrAgent = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_AGENT"));
        
        if (!isAdminOrAgent) {
            tickets = tickets.stream()
                .filter(t -> currentUser.getId().equals(t.getCreatedBy()))
                .collect(Collectors.toList());
        }

        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        if (!isAuthorizedToAccess(ticket)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(ticket, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketUpdateDTO ticketDetails) {
        Ticket ticket = ticketService.getTicketById(id);
        if (!isAuthorizedToAccess(ticket)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Ticket updatedTicket = ticketService.updateTicket(id, ticketDetails);
        return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        
        Ticket ticket = ticketService.getTicketById(id);
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdminOrAgent = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_AGENT"));
        
        if (!isAdminOrAgent) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only agents/admins can change status
        }
        
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

    private boolean isAuthorizedToAccess(Ticket ticket) {
        UserDetailsImpl currentUser = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdminOrAgent = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_AGENT"));
        return isAdminOrAgent || currentUser.getId().equals(ticket.getCreatedBy());
    }
}
