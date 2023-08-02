package com.demo.usermanagement;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class UserController {
    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/users")
    ResponseEntity<List<User>> getAllUsers() {
        List<User> users =  repository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/user/{id}")
    ResponseEntity<User> getUser(@PathVariable Long id) {
        Optional<User> user = repository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/user")
    ResponseEntity<User> addUser(@RequestBody User userObject) {
        try {
            User newUser = repository.save(userObject);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
    @PostMapping("/action")
    ResponseEntity<HttpStatus> validateAction(@RequestBody ActionRequest actionRequest){
        Long userId = actionRequest.getUserId();
        Action action = actionRequest.getAction();

        Optional<User> userOptional = repository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getActions().contains(action)) {
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                // The user is not allowed to execute the action.
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            // User not found.
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/user/{id}")
    ResponseEntity<User> updateUser(@RequestBody User userObject, @PathVariable Long id) {
        Optional<User> optionalUser = repository.findById(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            existingUser.setFirstName(userObject.getFirstName());
            existingUser.setLastName(userObject.getLastName());
            existingUser.setEmail(userObject.getEmail());
            existingUser.setActions(userObject.getActions());

            try {
                return ResponseEntity.ok(repository.save(existingUser));
            } catch (DataIntegrityViolationException e) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/user/{id}")
    ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id) {

        try {
            Optional<User> optionalUser = repository.findById(id);
            if (optionalUser.isPresent()) {
                repository.deleteById(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
