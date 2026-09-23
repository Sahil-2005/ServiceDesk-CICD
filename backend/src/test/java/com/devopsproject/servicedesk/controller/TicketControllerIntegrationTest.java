package com.devopsproject.servicedesk.controller;

import com.devopsproject.servicedesk.dto.TicketUpdateDTO;
import com.devopsproject.servicedesk.model.Ticket;
import com.devopsproject.servicedesk.model.TicketPriority;
import com.devopsproject.servicedesk.model.TicketStatus;
import com.devopsproject.servicedesk.repository.TicketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TicketControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        ticketRepository.deleteAll();
    }

    // --- CREATE ---

    @Test
    void createTicket_ValidInput_ReturnsCreatedTicket() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setTitle("Network Issue");
        ticket.setDescription("Cannot connect to Wi-Fi");
        ticket.setCategory("Network");
        ticket.setPriority(TicketPriority.HIGH);
        ticket.setStatus(TicketStatus.OPEN);

        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("Network Issue")))
                .andExpect(jsonPath("$.status", is("OPEN")));
    }

    @Test
    void createTicket_MissingRequiredFields_ReturnsBadRequest() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setTitle(""); // Invalid, should not be blank

        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ticket)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", notNullValue()))
                .andExpect(jsonPath("$.description", notNullValue()))
                .andExpect(jsonPath("$.category", notNullValue()));
    }

    // --- GET ---

    @Test
    void getTicket_ExistingId_ReturnsTicket() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setTitle("Hardware Issue");
        ticket.setDescription("Mouse not working");
        ticket.setCategory("Hardware");
        ticket.setStatus(TicketStatus.OPEN);
        ticket = ticketRepository.save(ticket);

        mockMvc.perform(get("/api/tickets/" + ticket.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Hardware Issue")));
    }

    @Test
    void getTicket_NonExistingId_ReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/tickets/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    // --- UPDATE (PUT) ---

    @Test
    void updateTicket_WithoutStatusField_Succeeds() throws Exception {
        // Create a ticket with ASSIGNED status
        Ticket ticket = new Ticket();
        ticket.setTitle("Original Title");
        ticket.setDescription("Original Description");
        ticket.setCategory("Hardware");
        ticket.setPriority(TicketPriority.LOW);
        ticket.setStatus(TicketStatus.ASSIGNED);
        ticket = ticketRepository.save(ticket);

        // Update with DTO that has no status field
        TicketUpdateDTO updateDTO = new TicketUpdateDTO();
        updateDTO.setTitle("Updated Title");
        updateDTO.setDescription("Updated Description");
        updateDTO.setCategory("Software");
        updateDTO.setPriority(TicketPriority.HIGH);

        mockMvc.perform(put("/api/tickets/" + ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Title")))
                .andExpect(jsonPath("$.description", is("Updated Description")))
                .andExpect(jsonPath("$.category", is("Software")))
                .andExpect(jsonPath("$.priority", is("HIGH")))
                .andExpect(jsonPath("$.status", is("ASSIGNED"))); // Status preserved
    }

    @Test
    void updateTicket_MissingRequiredFields_ReturnsBadRequest() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setTitle("Original Title");
        ticket.setDescription("Original Description");
        ticket.setCategory("Hardware");
        ticket.setStatus(TicketStatus.OPEN);
        ticket = ticketRepository.save(ticket);

        TicketUpdateDTO updateDTO = new TicketUpdateDTO();
        updateDTO.setTitle(""); // Invalid

        mockMvc.perform(put("/api/tickets/" + ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", notNullValue()))
                .andExpect(jsonPath("$.description", notNullValue()))
                .andExpect(jsonPath("$.category", notNullValue()));
    }

    // --- STATUS UPDATE (PATCH) ---

    @Test
    void updateTicketStatus_ValidTransition_ReturnsUpdatedTicket() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setTitle("Hardware Issue");
        ticket.setDescription("Mouse not working");
        ticket.setCategory("Hardware");
        ticket.setStatus(TicketStatus.OPEN);
        ticket = ticketRepository.save(ticket);

        Map<String, String> payload = new HashMap<>();
        payload.put("status", "ASSIGNED");

        mockMvc.perform(patch("/api/tickets/" + ticket.getId() + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("ASSIGNED")));
    }

    @Test
    void updateTicketStatus_InvalidTransition_ReturnsBadRequest() throws Exception {
        Ticket ticket = new Ticket();
        ticket.setTitle("Hardware Issue");
        ticket.setDescription("Mouse not working");
        ticket.setCategory("Hardware");
        ticket.setStatus(TicketStatus.OPEN);
        ticket = ticketRepository.save(ticket);

        Map<String, String> payload = new HashMap<>();
        payload.put("status", "RESOLVED");

        mockMvc.perform(patch("/api/tickets/" + ticket.getId() + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }
}
