package com.serviceprovider.demo.dto;

import lombok.Data;

@Data
public class ExtraChargeRequestDTO {
    private Double extraAmount;
    private String reason;
}
