package com.serviceprovider.demo.dto;

import lombok.Data;

@Data
public class ReviewRequestDTO {

    private Long bookingId;
    private Long customerId;
    private Integer rating;
    private String comment;
}