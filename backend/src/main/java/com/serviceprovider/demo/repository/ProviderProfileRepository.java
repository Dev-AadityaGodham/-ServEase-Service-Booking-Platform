package com.serviceprovider.demo.repository;

import com.serviceprovider.demo.Entity.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUserId(Long userId);
}
