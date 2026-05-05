package com.serviceprovider.demo.controller;

import com.serviceprovider.demo.Entity.Review;
import com.serviceprovider.demo.dto.ReviewRequestDTO;
import com.serviceprovider.demo.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequestDTO dto) {
        return ResponseEntity.ok(reviewService.createReview(dto));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Review>> getReviewsByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getReviewsByProvider(providerId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<Review> getReviewByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(reviewService.getReviewByBooking(bookingId));
    }

    @GetMapping("/booking/{bookingId}/exists")
    public ResponseEntity<Boolean> reviewExistsForBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(reviewService.reviewExistsForBooking(bookingId));
    }
}
