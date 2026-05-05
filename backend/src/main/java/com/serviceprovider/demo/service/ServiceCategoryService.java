package com.serviceprovider.demo.service;

import com.serviceprovider.demo.Entity.ServiceCategory;
import com.serviceprovider.demo.dto.ServiceCategoryRequestDTO;
import com.serviceprovider.demo.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCategoryService {

    private final ServiceCategoryRepository serviceCategoryRepository;

    public ServiceCategory createService(ServiceCategoryRequestDTO dto) {
        ServiceCategory service = ServiceCategory.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .basePrice(dto.getBasePrice())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return serviceCategoryRepository.save(service);
    }

    public List<ServiceCategory> getAllServices() {
        return serviceCategoryRepository.findAll();
    }

    public ServiceCategory getServiceById(Long id) {
        return serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }
}