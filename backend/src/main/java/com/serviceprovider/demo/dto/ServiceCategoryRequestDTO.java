package com.serviceprovider.demo.dto;

import lombok.Data;

@Data
public class ServiceCategoryRequestDTO {
    private String name;
    private String description;
    private Double basePrice;
}
