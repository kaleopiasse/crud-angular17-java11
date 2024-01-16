package com.example.api.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.example.api.domain.Customer;

public interface CustomerRepository extends PagingAndSortingRepository<Customer, Long> {

	Page<Customer> findAllByOrderByNameAsc(Pageable pageable);

	List<Customer> findByNameContainingOrEmailContainingOrGenderOrAddressesCityContainingOrAddressesStateContainingOrderByNameAsc(String name, String email, String gender, String city, String state);

}
