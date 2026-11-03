package com.quickkart.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickkart.entity.WishlistItem;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByUserId(Long userId);

    Optional<WishlistItem> findByUserIdAndProductId(Long userId, Long productId);
}
