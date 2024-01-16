package com.example.api.web.rest;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.api.domain.Customer;
import com.example.api.service.CustomerService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class CustomerController {

	private CustomerService service;

	@Autowired
	public CustomerController(CustomerService service) {
		this.service = service;
	}

	@GetMapping("/customers")
	public Page<Customer> findAll(Pageable pageable) {
		return service.findAll(pageable);
	}

	@GetMapping("/customers/{id}")
	public Customer findById(@PathVariable Long id) {
		return service.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
	}

	@GetMapping("/customers/search")
	public List<Customer> findByNameByEmailByGender(
		@RequestParam(required = false) String name, @RequestParam(required = false) String email, @RequestParam(required = false) String gender,
		@RequestParam(required = false) String city, @RequestParam(required = false) String state
	) {
		return service.findAllByNameByEmailByGenderByCityByState(name, email, gender, city, state);
	}

	@PostMapping("/customers")
	public Customer create(@RequestBody @Valid Customer customer){
		System.out.println(customer.getName() + customer.getEmail() + customer.getGender() + customer.getId());
	    return service.save(customer);
	}

	@DeleteMapping("/customers/{id}")
  	public Customer delete(@PathVariable("id") long id) {
		Customer customer = findById(id);
    	
		if(customer != null) {
			service.delete(id);
		}

		return customer;
  	}

	@PutMapping("/customers/{id}")
  	public Customer update(@PathVariable("id") long id, @RequestBody @Valid Customer customerUpdate) {
		Customer customer = findById(id);
    	
		if(customer != null) {
			customer.setName(customerUpdate.getName());
			customer.setEmail(customerUpdate.getEmail());
			customer.setGender(customerUpdate.getGender());
			customer = service.save(customer);
		}

		return customer;
  	}

}
