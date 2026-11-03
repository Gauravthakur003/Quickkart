package com.quickkart.dto;

import com.quickkart.entity.PaymentMethod;

import jakarta.validation.constraints.NotNull;

public record OrderRequest(@NotNull
        Long addressId, @NotNull
        PaymentMethod paymentMethod) {}
