package com.example.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.api.domain.Customer;
import com.example.api.repository.CustomerRepository;

@Service
public class CustomerService {

	private CustomerRepository repository;

	@Autowired
	public CustomerService(CustomerRepository repository) {
		this.repository = repository;
	}

	public Page<Customer> findAll(Pageable pageable) {
		return repository.findAllByOrderByNameAsc(pageable);
	}
	
	public List<Customer> findAllByNameByEmailByGenderByCityByState(String name, String email, String gender, String city, String state) {
		return repository.findByNameContainingOrEmailContainingOrGenderOrAddressesCityContainingOrAddressesStateContainingOrderByNameAsc(name, email, gender, city, state);
	}

	public Optional<Customer> findById(Long id) {
		return repository.findById(id);
	}

	public Customer save(Customer customer) {
		System.out.println(customer.getName() + customer.getEmail() + customer.getGender() + customer.getId());
		return repository.save(customer);
	}

	public void delete(Long id) {
		repository.deleteById(id);
	}

}
