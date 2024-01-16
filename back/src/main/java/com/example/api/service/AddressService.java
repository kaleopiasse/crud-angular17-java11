package com.example.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.api.domain.Address;
import com.example.api.repository.AddressRepository;

@Service
public class AddressService {
    
    private AddressRepository repository;

    @Autowired
    public AddressService(AddressRepository repository) {
        this.repository = repository;
    }

    public List<Address> findAllByCustomerId(Long customerId) {
        return repository.findByCustomerId(customerId);
    }

    public Address save(Address address) {
		// System.out.println(customer.getName() + customer.getEmail() + customer.getGender() + customer.getId());
		return repository.save(address);
	}
}
