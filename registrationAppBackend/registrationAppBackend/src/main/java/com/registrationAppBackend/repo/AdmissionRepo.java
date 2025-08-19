package com.registrationAppBackend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.registrationAppBackend.entity.Admission;
import com.registrationAppBackend.entity.User;

import java.util.Optional;


@Repository
public interface AdmissionRepo extends JpaRepository<Admission, Integer>{
	
	Admission findByUser(Optional<User> foundUser);

}
