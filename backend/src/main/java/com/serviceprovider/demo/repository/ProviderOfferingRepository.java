package com.serviceprovider.demo.repository;

import com.serviceprovider.demo.Entity.ProviderOffering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderOfferingRepository extends JpaRepository<ProviderOffering, Long> {

    List<ProviderOffering> findByProviderId(Long providerId);

    Optional<ProviderOffering> findByProviderIdAndServiceCategoryId(
            Long providerId,
            Long serviceCategoryId
    );
    List<ProviderOffering> findByServiceCategoryId(Long serviceId);
    List<ProviderOffering> findByServiceCategoryIdAndProviderUserIdNot(
            Long serviceId,
            Long userId
    );
}
