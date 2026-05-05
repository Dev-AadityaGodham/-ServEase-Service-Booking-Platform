package com.serviceprovider.demo.service;

import com.serviceprovider.demo.Entity.*;
import com.serviceprovider.demo.dto.BookingRequestDTO;
import com.serviceprovider.demo.dto.ExtraChargeRequestDTO;
import com.serviceprovider.demo.repository.BookingRepository;
import com.serviceprovider.demo.repository.ProviderOfferingRepository;
import com.serviceprovider.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProviderOfferingRepository providerOfferingRepository;

    public Booking createBooking(BookingRequestDTO dto) {

        User customer = userRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        ProviderOffering offering = providerOfferingRepository.findById(dto.getProviderOfferingId())
                .orElseThrow(() -> new RuntimeException("Provider offering not found"));
        if (dto.getBookingDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Booking time must be in the future");
        }
        Booking booking = Booking.builder()
                .customer(customer)
                .providerOffering(offering)
                .address(dto.getAddress())
                .note(dto.getNote())
                .bookingDateTime(dto.getBookingDateTime())
                .totalAmount(offering.getPrice())
                .finalAmount(offering.getPrice())
                .extraAmount(0.0)
                .extraChargeStatus(ExtraChargeStatus.NONE)
                .status(BookingStatus.PENDING)
                .expiresAt(dto.getBookingDateTime())
                .createdAt(LocalDateTime.now())
                .build();

        return bookingRepository.save(booking);
    }
    public Booking markWorkDone(Long bookingId, ExtraChargeRequestDTO dto) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Only accepted bookings can be marked as work done");
        }

        if (dto.getExtraAmount() != null && dto.getExtraAmount() > 0) {
            booking.setStatus(BookingStatus.WORK_DONE);
            booking.setExtraAmount(dto.getExtraAmount());
            booking.setExtraChargeReason(dto.getReason());
            booking.setExtraChargeStatus(ExtraChargeStatus.REQUESTED);
        } else {
            booking.setStatus(BookingStatus.COMPLETED);
            booking.setExtraAmount(0.0);
            booking.setExtraChargeReason(null);
            booking.setExtraChargeStatus(ExtraChargeStatus.NONE);
            booking.setFinalAmount(booking.getTotalAmount());
        }

        return bookingRepository.save(booking);
    }

    public Booking approveExtraCharge(Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.WORK_DONE ||
                booking.getExtraChargeStatus() != ExtraChargeStatus.REQUESTED) {
            throw new RuntimeException("No pending extra charge request found");
        }

        booking.setExtraChargeStatus(ExtraChargeStatus.APPROVED);
        booking.setFinalAmount(booking.getTotalAmount() + booking.getExtraAmount());
        booking.setStatus(BookingStatus.COMPLETED);

        return bookingRepository.save(booking);
    }

    public Booking rejectExtraCharge(Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.WORK_DONE ||
                booking.getExtraChargeStatus() != ExtraChargeStatus.REQUESTED) {
            throw new RuntimeException("No pending extra charge request found");
        }

        booking.setExtraChargeStatus(ExtraChargeStatus.REJECTED);
        booking.setFinalAmount(booking.getTotalAmount());
        booking.setStatus(BookingStatus.COMPLETED);

        return bookingRepository.save(booking);
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getIncomingRequests(Long providerId) {
        return bookingRepository
                .findByProviderOfferingProviderIdAndStatusAndExpiresAtAfter(
                        providerId,
                        BookingStatus.PENDING,
                        LocalDateTime.now()
                );
    }

    public List<Booking> getProviderBookings(Long providerId) {
        return bookingRepository.findByProviderOfferingProviderId(providerId);
    }

    public Booking acceptBooking(Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be accepted");
        }

        if (booking.getExpiresAt().isBefore(LocalDateTime.now())) {
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw new RuntimeException("Booking request expired");
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setRespondedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        if (booking.getExpiresAt().isBefore(LocalDateTime.now())) {
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw new RuntimeException("Booking request expired");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRespondedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public Booking completeBooking(Long bookingId) {
        Booking booking = getBookingOrThrow(bookingId);

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Only accepted bookings can be completed");
        }

        booking.setStatus(BookingStatus.COMPLETED);

        return bookingRepository.save(booking);
    }

    private Booking getBookingOrThrow(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
}
