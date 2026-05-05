package com.serviceprovider.demo.dto;

import lombok.Data;

@Data
public class ProviderOfferingRequestDTO {
    private Long providerId;
    private Long serviceId;
    private Double price;
}
