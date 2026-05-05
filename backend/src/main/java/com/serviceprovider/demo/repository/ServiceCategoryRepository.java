package com.serviceprovider.demo.repository;

import com.serviceprovider.demo.Entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
}