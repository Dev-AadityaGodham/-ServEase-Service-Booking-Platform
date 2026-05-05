package com.serviceprovider.demo.controller;

import com.serviceprovider.demo.Entity.ProviderOffering;
import com.serviceprovider.demo.dto.ProviderOfferingRequestDTO;
import com.serviceprovider.demo.service.ProviderOfferingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/provider-offerings")
@RequiredArgsConstructor
public class ProviderOfferingController {

    private final ProviderOfferingService providerOfferingService;

    @PostMapping("/add")
    public ResponseEntity<ProviderOffering> addOffering(
            @RequestBody ProviderOfferingRequestDTO dto
    ) {
        return ResponseEntity.ok(providerOfferingService.addOffering(dto));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderOffering>> getOfferingsByProvider(
            @PathVariable Long providerId
    ) {
        return ResponseEntity.ok(providerOfferingService.getOfferingsByProvider(providerId));
    }

    @GetMapping
    public ResponseEntity<List<ProviderOffering>> getAllOfferings() {
        return ResponseEntity.ok(providerOfferingService.getAllOfferings());
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ProviderOffering>> getOfferingsByService(
            @PathVariable Long serviceId
    ) {
        return ResponseEntity.ok(
                providerOfferingService.getOfferingsByService(serviceId)
        );
    }
    @GetMapping("/service/{serviceId}/customer/{customerId}")
    public ResponseEntity<List<ProviderOffering>> getOfferingsByServiceForCustomer(
            @PathVariable Long serviceId,
            @PathVariable Long customerId
    ) {
        return ResponseEntity.ok(
                providerOfferingService.getOfferingsByServiceForCustomer(serviceId, customerId)
        );
    }
}