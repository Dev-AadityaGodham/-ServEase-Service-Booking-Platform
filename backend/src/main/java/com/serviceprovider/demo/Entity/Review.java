package com.serviceprovider.demo.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which booking this review belongs to
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    // Customer who gave review
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Provider who received review
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderProfile provider;

    private Integer rating; // 1 to 5

    private String comment;

    private LocalDateTime createdAt;
}