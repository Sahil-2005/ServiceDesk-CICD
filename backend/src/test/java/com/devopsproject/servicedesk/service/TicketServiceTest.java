package com.devopsproject.servicedesk.service;

import com.devopsproject.servicedesk.exception.InvalidStatusTransitionException;
import com.devopsproject.servicedesk.model.Ticket;
import com.devopsproject.servicedesk.model.TicketStatus;
import com.devopsproject.servicedesk.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private TicketService ticketService;

    private Ticket ticket;

    @BeforeEach
    void setUp() {
        ticket = new Ticket();
        ticket.setId(1L);
        ticket.setTitle("Test Ticket");
        ticket.setDescription("Test Description");
        ticket.setStatus(TicketStatus.OPEN);
    }

    @Test
    void createTicket_SetsStatusToOpen() {
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);

        Ticket created = ticketService.createTicket(new Ticket());

        assertEquals(TicketStatus.OPEN, created.getStatus());
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    void validStatusTransition_OpenToAssigned_Success() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);

        Ticket updated = ticketService.updateTicketStatus(1L, TicketStatus.ASSIGNED, null);

        assertEquals(TicketStatus.ASSIGNED, updated.getStatus());
    }

    @Test
    void invalidStatusTransition_OpenToResolved_ThrowsException() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        assertThrows(InvalidStatusTransitionException.class, () -> {
            ticketService.updateTicketStatus(1L, TicketStatus.RESOLVED, "Resolved");
        });
    }

    @Test
    void validStatusTransition_InProgressToResolved_WithoutNotes_ThrowsException() {
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        assertThrows(InvalidStatusTransitionException.class, () -> {
            ticketService.updateTicketStatus(1L, TicketStatus.RESOLVED, null); // No notes
        });
    }
    
    @Test
    void validStatusTransition_InProgressToResolved_WithNotes_Success() {
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArguments()[0]);

        Ticket updated = ticketService.updateTicketStatus(1L, TicketStatus.RESOLVED, "Fixed issue");
        
        assertEquals(TicketStatus.RESOLVED, updated.getStatus());
        assertEquals("Fixed issue", updated.getResolutionNotes());
    }

    @Test
    void validStatusTransition_Reassignment_AnyToAssigned_Success() {
        ticket.setStatus(TicketStatus.RESOLVED);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArguments()[0]);

        Ticket updated = ticketService.updateTicketStatus(1L, TicketStatus.ASSIGNED, null);

        assertEquals(TicketStatus.ASSIGNED, updated.getStatus());
    }
}
