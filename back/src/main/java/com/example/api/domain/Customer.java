package com.example.api.domain;

import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Entity
@Table(name = "CUSTOMERS")
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@NotEmpty(message = "Name cannot be empty")
	@NotNull(message = "Name cannot be null")
	@NotBlank(message = "Name cannot be blank")
	private String name;

	@Column(nullable = false)
	@NotEmpty(message = "Email cannot empty")
	@NotNull(message = "Email cannot null")
	@Email(message = "Email must be valid")
	private String email;

	@Column(nullable = false)
	@NotEmpty(message = "Gender cannot be empty")
	@NotNull(message = "Gender cannot be null")
	@Pattern(regexp = "(M|F)", message = "Gender must be 'M' or 'F'")
	private String gender;

	@OneToMany(mappedBy = "customer", fetch = FetchType.EAGER)
	private Set<Address> addresses;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Set<Address> getAddresses() {
		return addresses;
	}

	public void setAddresses(Set<Address> addresses) {
		this.addresses = addresses;
	}

}
