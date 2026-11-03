package com.quickkart.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
    @Column(nullable = false, length = 100)
    private String fullName;
    @Column(nullable = false, length = 15)
    private String phone;
    @Column(nullable = false, length = 250)
    private String line1;
    @Column(length = 250)
    private String line2;
    @Column(nullable = false, length = 80)
    private String city;
    @Column(nullable = false, length = 80)
    private String state;
    @Column(nullable = false, length = 10)
    private String postalCode;
    @Column(nullable = false, length = 60)
    private String country = "India";
    @Column(nullable = false)
    private boolean defaultAddress;

    public Long getId() {
        return id;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser v) {
        user = v;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String v) {
        fullName = v;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String v) {
        phone = v;
    }

    public String getLine1() {
        return line1;
    }

    public void setLine1(String v) {
        line1 = v;
    }

    public String getLine2() {
        return line2;
    }

    public void setLine2(String v) {
        line2 = v;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String v) {
        city = v;
    }

    public String getState() {
        return state;
    }

    public void setState(String v) {
        state = v;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String v) {
        postalCode = v;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String v) {
        country = v;
    }

    public boolean isDefaultAddress() {
        return defaultAddress;
    }

    public void setDefaultAddress(boolean v) {
        defaultAddress = v;
    }
}
