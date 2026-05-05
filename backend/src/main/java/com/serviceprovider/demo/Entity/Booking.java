package com.serviceprovider.demo.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer who books
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Provider's selected service
    @ManyToOne
    @JoinColumn(name = "provider_offering_id", nullable = false)
    private ProviderOffering providerOffering;

    private String address;

    private String note;

    private LocalDateTime bookingDateTime;

    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime expiresAt;

    private LocalDateTime respondedAt;

    private LocalDateTime createdAt;

    private Double finalAmount;

    private Double extraAmount;

    private String extraChargeReason;

    private Boolean extraChargeApproved;

    @Enumerated(EnumType.STRING)
    private ExtraChargeStatus extraChargeStatus;
}