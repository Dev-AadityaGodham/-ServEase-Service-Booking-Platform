package com.serviceprovider.demo.controller;

import com.serviceprovider.demo.Entity.ServiceCategory;
import com.serviceprovider.demo.dto.ServiceCategoryRequestDTO;
import com.serviceprovider.demo.service.ServiceCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private final ServiceCategoryService serviceCategoryService;

    @PostMapping
    public ResponseEntity<ServiceCategory> createService(
            @RequestBody ServiceCategoryRequestDTO dto
    ) {
        return ResponseEntity.ok(serviceCategoryService.createService(dto));
    }

    @GetMapping
    public ResponseEntity<List<ServiceCategory>> getAllServices() {
        return ResponseEntity.ok(serviceCategoryService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceCategory> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceCategoryService.getServiceById(id));
    }
}