package com.quickkart.config;
import com.quickkart.entity.*;
import com.quickkart.repository.CategoryRepository;
import com.quickkart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
public class DataInitializer {
 @Bean CommandLineRunner seed(UserRepository users,CategoryRepository categories,PasswordEncoder encoder,
   @Value("${app.admin.email:admin@quickkart.local}") String adminEmail,
   @Value("${app.admin.password:ChangeMe123!}") String adminPassword){
  return args->{if(!users.existsByEmailIgnoreCase(adminEmail)){AppUser a=new AppUser();a.setName("QuickKart Admin");a.setEmail(adminEmail);a.setPhone("9999999999");a.setPasswordHash(encoder.encode(adminPassword));a.setRole(Role.ADMIN);users.save(a);}
   String[] names={"Electronics","Home","Beauty","Fashion","Groceries"};for(String name:names){if(categories.findAll().stream().noneMatch(c->c.getName().equalsIgnoreCase(name))){Category c=new Category();c.setName(name);c.setDescription(name+" products");categories.save(c);}}
  };
 }
}
