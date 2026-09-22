package com.devopsproject.servicedesk.service;

import com.devopsproject.servicedesk.exception.InvalidStatusTransitionException;
import com.devopsproject.servicedesk.exception.ResourceNotFoundException;
import com.devopsproject.servicedesk.model.Ticket;
import com.devopsproject.servicedesk.model.TicketStatus;
import com.devopsproject.servicedesk.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        return ticketRepository.save(ticket);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> searchTickets(String keyword, TicketStatus status, String category) {
        return ticketRepository.searchTickets(keyword, status, category);
    }

    public Ticket updateTicket(Long id, Ticket ticketDetails) {
        Ticket existingTicket = getTicketById(id);

        // Update basic fields. DO NOT update status here (must use dedicated status endpoint)
        existingTicket.setTitle(ticketDetails.getTitle());
        existingTicket.setDescription(ticketDetails.getDescription());
        existingTicket.setCategory(ticketDetails.getCategory());
        existingTicket.setPriority(ticketDetails.getPriority());
        existingTicket.setAssignedTo(ticketDetails.getAssignedTo());
        existingTicket.setResolutionNotes(ticketDetails.getResolutionNotes());

        return ticketRepository.save(existingTicket);
    }

    public Ticket updateTicketStatus(Long id, TicketStatus newStatus, String resolutionNotes) {
        Ticket existingTicket = getTicketById(id);
        TicketStatus currentStatus = existingTicket.getStatus();

        validateStatusTransition(currentStatus, newStatus, resolutionNotes);

        existingTicket.setStatus(newStatus);
        
        if (resolutionNotes != null && !resolutionNotes.trim().isEmpty()) {
            existingTicket.setResolutionNotes(resolutionNotes);
        }

        return ticketRepository.save(existingTicket);
    }

    private void validateStatusTransition(TicketStatus currentStatus, TicketStatus newStatus, String resolutionNotes) {
        // Any state -> ASSIGNED (reassignment)
        if (newStatus == TicketStatus.ASSIGNED) {
            return; // Allowed from any state
        }

        boolean isValid = false;

        switch (currentStatus) {
            case OPEN:
                isValid = (newStatus == TicketStatus.ASSIGNED);
                break;
            case ASSIGNED:
                isValid = (newStatus == TicketStatus.IN_PROGRESS);
                break;
            case IN_PROGRESS:
                isValid = (newStatus == TicketStatus.RESOLVED);
                if (isValid && (resolutionNotes == null || resolutionNotes.trim().isEmpty())) {
                    throw new InvalidStatusTransitionException("Resolution notes are required to mark a ticket as RESOLVED.");
                }
                break;
            case RESOLVED:
                isValid = (newStatus == TicketStatus.CLOSED);
                break;
            case CLOSED:
                isValid = false; // Terminal state, except for reassignment handled above
                break;
        }

        if (!isValid) {
            throw new InvalidStatusTransitionException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }
}
