package com.serviceprovider.demo.controller;

import com.serviceprovider.demo.Entity.ProviderProfile;
import com.serviceprovider.demo.dto.ProviderRequestDTO;
import com.serviceprovider.demo.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createProvider(
            @PathVariable Long userId,
            @RequestBody ProviderRequestDTO dto
    ) {
        ProviderProfile profile = providerService.createProvider(userId, dto);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<?> getMyProfile(@PathVariable Long userId) {
        ProviderProfile profile = providerService.getMyProfile(userId);
        return ResponseEntity.ok(profile);
    }
}
