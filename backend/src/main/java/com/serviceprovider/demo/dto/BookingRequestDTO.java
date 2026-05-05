package com.serviceprovider.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequestDTO {
    private Long customerId;
    private Long providerOfferingId;
    private String address;
    private String note;
    private LocalDateTime bookingDateTime;
}
