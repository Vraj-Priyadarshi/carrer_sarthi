package com.hackathon.securestarter.repository;

import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.enums.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByEmailAndAuthProvider(String email, AuthProvider authProvider);

}
