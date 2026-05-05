package com.serviceprovider.demo.service;

import com.serviceprovider.demo.Entity.ProviderProfile;
import com.serviceprovider.demo.Entity.User;
import com.serviceprovider.demo.dto.ProviderRequestDTO;
import com.serviceprovider.demo.repository.ProviderProfileRepository;
import com.serviceprovider.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderProfileRepository providerRepo;
    private final UserRepository userRepo;

    public ProviderProfile createProvider(Long userId, ProviderRequestDTO dto) {

        // Check if already provider
        if (providerRepo.findByUserId(userId).isPresent()) {
            throw new RuntimeException("User already a provider");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProviderProfile profile = ProviderProfile.builder()
                .user(user)
                .description(dto.getDescription())
                .experience(dto.getExperience())
                .serviceRadius(dto.getServiceRadius())
                .available(true)
                .rating(0.0)
                .totalReviews(0)
                .createdAt(LocalDateTime.now())
                .build();

        return providerRepo.save(profile);
    }

    public ProviderProfile getMyProfile(Long userId) {
        return providerRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
    }
}