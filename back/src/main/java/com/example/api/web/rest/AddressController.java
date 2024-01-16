package com.example.api.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.api.domain.Address;
import com.example.api.domain.Customer;
import com.example.api.service.AddressService;
import com.example.api.service.CustomerService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class AddressController {
    
    private AddressService addressService;
    private CustomerService customerService;

    @Autowired
    public AddressController(AddressService addressService, CustomerService customerService) {
        this.addressService = addressService;
        this.customerService = customerService;

    }

    @GetMapping("/customers/{customerId}/addresses")
    public List<Address> getAllAddressesByCustomerId(@PathVariable Long customerId) {
        customerService.findById(customerId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        return addressService.findAllByCustomerId(customerId);
    }

    @PostMapping("/customers/{customerId}/addresses")
    public Address create(@PathVariable(value = "customerId") Long customerId, @RequestBody Address addressRequest) {
      Customer customer = customerService.findById(customerId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

      if(customer != null) {
        addressRequest.setCustomer(customer);

        addressRequest = addressService.save(addressRequest);
      }

      return addressRequest;
    
    }


}
