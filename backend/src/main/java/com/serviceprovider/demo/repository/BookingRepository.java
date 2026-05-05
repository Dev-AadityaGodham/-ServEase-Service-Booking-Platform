package com.serviceprovider.demo.repository;

import com.serviceprovider.demo.Entity.Booking;
import com.serviceprovider.demo.Entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByProviderOfferingProviderIdAndStatusAndExpiresAtAfter(
            Long providerId,
            BookingStatus status,
            LocalDateTime now
    );

    List<Booking> findByProviderOfferingProviderId(Long providerId);
}
