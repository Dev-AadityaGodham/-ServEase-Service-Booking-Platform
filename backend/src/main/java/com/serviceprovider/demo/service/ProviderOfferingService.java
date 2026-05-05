package com.serviceprovider.demo.service;

import com.serviceprovider.demo.Entity.ProviderOffering;
import com.serviceprovider.demo.Entity.ProviderProfile;
import com.serviceprovider.demo.Entity.ServiceCategory;
import com.serviceprovider.demo.dto.ProviderOfferingRequestDTO;
import com.serviceprovider.demo.repository.ProviderOfferingRepository;
import com.serviceprovider.demo.repository.ProviderProfileRepository;
import com.serviceprovider.demo.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderOfferingService {

    private final ProviderOfferingRepository providerOfferingRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    public ProviderOffering addOffering(ProviderOfferingRequestDTO dto) {

        ProviderProfile provider = providerProfileRepository.findById(dto.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));

        ServiceCategory serviceCategory = serviceCategoryRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service category not found"));

        if (providerOfferingRepository
                .findByProviderIdAndServiceCategoryId(dto.getProviderId(), dto.getServiceId())
                .isPresent()) {
            throw new RuntimeException("This service is already added by provider");
        }

        ProviderOffering offering = ProviderOffering.builder()
                .provider(provider)
                .serviceCategory(serviceCategory)
                .price(dto.getPrice())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return providerOfferingRepository.save(offering);
    }

    public List<ProviderOffering> getOfferingsByProvider(Long providerId) {
        return providerOfferingRepository.findByProviderId(providerId);
    }

    public List<ProviderOffering> getAllOfferings() {
        return providerOfferingRepository.findAll();
    }

    public List<ProviderOffering> getOfferingsByService(Long serviceId) {
        return providerOfferingRepository.findByServiceCategoryId(serviceId);
    }

    public List<ProviderOffering> getOfferingsByServiceForCustomer(Long serviceId, Long customerId) {
        return providerOfferingRepository
                .findByServiceCategoryIdAndProviderUserIdNot(serviceId, customerId);
    }
}
