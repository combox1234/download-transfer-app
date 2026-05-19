package com.autobackup.api.security

import com.autobackup.api.model.entity.UserEntity
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

/**
 * Custom UserDetails implementation for JWT authentication.
 */
class JwtUserDetails(
    private val user: UserEntity,
) : UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return emptyList() // No role-based auth for now
    }

    override fun getPassword(): String {
        return user.passwordHash
    }

    override fun getUsername(): String {
        return user.id.toString()
    }

    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true

    fun getEmail(): String = user.email
    fun getId(): String = user.id.toString()
}
