package com.serviceprovider.demo.service;

import com.serviceprovider.demo.Entity.Booking;
import com.serviceprovider.demo.Entity.BookingStatus;
import com.serviceprovider.demo.Entity.ProviderProfile;
import com.serviceprovider.demo.Entity.Review;
import com.serviceprovider.demo.dto.ReviewRequestDTO;
import com.serviceprovider.demo.repository.BookingRepository;
import com.serviceprovider.demo.repository.ProviderProfileRepository;
import com.serviceprovider.demo.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ProviderProfileRepository providerProfileRepository;

    public Review createReview(ReviewRequestDTO dto) {

        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Review can be added only after booking is completed");
        }

        if (!booking.getCustomer().getId().equals(dto.getCustomerId())) {
            throw new RuntimeException("Only booking customer can review");
        }

        if (reviewRepository.existsByBookingId(dto.getBookingId())) {
            throw new RuntimeException("Review already submitted for this booking");
        }

        if (dto.getRating() == null || dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        ProviderProfile provider = booking.getProviderOffering().getProvider();

        Review review = Review.builder()
                .booking(booking)
                .customer(booking.getCustomer())
                .provider(provider)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        updateProviderRating(provider);

        return savedReview;
    }

    public List<Review> getReviewsByProvider(Long providerId) {
        return reviewRepository.findByProviderId(providerId);
    }

    public Review getReviewByBooking(Long bookingId) {
        return reviewRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Review not found for this booking"));
    }

    private void updateProviderRating(ProviderProfile provider) {
        List<Review> reviews = reviewRepository.findByProviderId(provider.getId());

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        provider.setRating(average);

        // Optional: keep internally, no need to show in UI
        provider.setTotalReviews(reviews.size());

        providerProfileRepository.save(provider);
    }
    public boolean reviewExistsForBooking(Long bookingId) {
        return reviewRepository.existsByBookingId(bookingId);
    }
}
