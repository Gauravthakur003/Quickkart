package com.quickkart.controller;

import com.quickkart.entity.*;
import com.quickkart.repository.AddressRepository;
import com.quickkart.service.CurrentUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressRepository addresses;
    private final CurrentUserService current;

    public AddressController(AddressRepository a, CurrentUserService c) {
        addresses = a;
        current = c;
    }

    @GetMapping
    public Object all() {
        return addresses.findByUserId(current.get().getId()).stream().map(ApiMapper::address).toList();
    }

    @PostMapping
    public Object create(@RequestBody Map<String, Object> body) {
        Address a = new Address();
        a.setUser(current.get());
        apply(a, body);
        if (Boolean.TRUE.equals(body.get("defaultAddress"))) {
            clearDefaults();
            a.setDefaultAddress(true);
        }
        return ApiMapper.address(addresses.save(a));
    }

    @PutMapping("/{id}")
    public Object update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Address a = owned(id);
        apply(a, body);
        if (Boolean.TRUE.equals(body.get("defaultAddress"))) {
            clearDefaults();
            a.setDefaultAddress(true);
        }
        return ApiMapper.address(addresses.save(a));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        addresses.delete(owned(id));
    }

    private Address owned(Long id) {
        return addresses.findByIdAndUserId(id, current.get().getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
    }

    private void clearDefaults() {
        addresses.findByUserId(current.get().getId()).forEach(a -> {
            a.setDefaultAddress(false);
            addresses.save(a);
        });
    }

    private void apply(Address a, Map<String, Object> b) {
        a.setFullName(str(b, "fullName"));
        a.setPhone(str(b, "phone"));
        a.setLine1(str(b, "line1"));
        a.setLine2(str(b, "line2"));
        a.setCity(str(b, "city"));
        a.setState(str(b, "state"));
        a.setPostalCode(str(b, "postalCode"));
        a.setCountry(b.getOrDefault("country", "India").toString());
        a.setDefaultAddress(Boolean.TRUE.equals(b.get("defaultAddress")));
    }

    private String str(Map<String, Object> b, String k) {
        return b.get(k) == null ? "" : b.get(k).toString().trim();
    }
}
