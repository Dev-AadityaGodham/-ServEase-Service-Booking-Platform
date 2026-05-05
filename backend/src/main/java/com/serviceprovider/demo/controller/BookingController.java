package com.serviceprovider.demo.controller;

import com.serviceprovider.demo.Entity.Booking;
import com.serviceprovider.demo.dto.BookingRequestDTO;
import com.serviceprovider.demo.dto.ExtraChargeRequestDTO;
import com.serviceprovider.demo.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDTO dto) {
        return ResponseEntity.ok(bookingService.createBooking(dto));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> getProviderBookings(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
    }

    @GetMapping("/provider/{providerId}/incoming")
    public ResponseEntity<List<Booking>> getIncomingRequests(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getIncomingRequests(providerId));
    }

    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<Booking> acceptBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.acceptBooking(bookingId));
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.rejectBooking(bookingId));
    }

    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.completeBooking(bookingId));
    }
    @PutMapping("/{bookingId}/work-done")
    public ResponseEntity<Booking> markWorkDone(
            @PathVariable Long bookingId,
            @RequestBody ExtraChargeRequestDTO dto
    ) {
        return ResponseEntity.ok(bookingService.markWorkDone(bookingId, dto));
    }

    @PutMapping("/{bookingId}/extra-charge/approve")
    public ResponseEntity<Booking> approveExtraCharge(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.approveExtraCharge(bookingId));
    }

    @PutMapping("/{bookingId}/extra-charge/reject")
    public ResponseEntity<Booking> rejectExtraCharge(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.rejectExtraCharge(bookingId));
    }
}