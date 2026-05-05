package com.serviceprovider.demo.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "provider_offerings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private ProviderProfile provider;

    // Which service category
    @ManyToOne
    @JoinColumn(name = "service_category_id", nullable = false)
    private ServiceCategory serviceCategory;

    // Provider's own price
    private Double price;

    private Boolean active;

    private LocalDateTime createdAt;
}