package com.autobackup.api.security

import com.autobackup.api.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.util.*

/**
 * Custom UserDetailsService implementation for JWT authentication.
 */
@Service
class JwtUserDetailsService(
    private val userRepository: UserRepository,
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findById(UUID.fromString(username))
            .orElseThrow { UsernameNotFoundException("User not found: $username") }
        return JwtUserDetails(user)
    }
}
