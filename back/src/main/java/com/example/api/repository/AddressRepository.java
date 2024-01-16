package com.example.api.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.api.domain.Address;

public interface AddressRepository extends CrudRepository <Address, Long> {
    
    List<Address> findByCustomerId(Long customerId);
}
