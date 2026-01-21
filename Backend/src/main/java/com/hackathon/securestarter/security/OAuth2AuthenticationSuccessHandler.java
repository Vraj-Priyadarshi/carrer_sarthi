package com.hackathon.securestarter.security;

import com.hackathon.securestarter.entity.User;
import com.hackathon.securestarter.enums.AuthProvider;
import com.hackathon.securestarter.enums.Role;
import com.hackathon.securestarter.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${oauth2.redirect-uri:http://localhost:3000/oauth2/redirect}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect.");
            return;
        }

        String targetUrl = determineTargetUrl(request, response, authentication);
        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String googleId = oAuth2User.getAttribute("sub");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        log.info("Google OAuth2 login attempt for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, googleId, firstName, lastName));

        if (user.getGoogleId() == null || !user.getGoogleId().equals(googleId)) {
            user.setGoogleId(googleId);
            user.setIsVerified(true);
            userRepository.save(user);
            log.info("Linked Google account to existing user: {}", email);
        }

        boolean needsPassword = user.getAuthProvider() == AuthProvider.GOOGLE
                && user.getPasswordHash() == null;

        String token = jwtService.generateToken(user);

        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("email", email)
                .queryParam("needsPassword", needsPassword)
                .queryParam("isNewUser", user.getFirstName() == null || user.getLastName() == null)
                .build()
                .toUriString();
    }

    private User createGoogleUser(String email, String googleId, String firstName, String lastName) {
        log.info("Creating new Google user with email: {}", email);

        User newUser = User.builder()
                .email(email)
                .googleId(googleId)
                .firstName(firstName)
                .lastName(lastName)
                .authProvider(AuthProvider.GOOGLE)
                .role(Role.USER)
                .isVerified(true)
                .build();

        return userRepository.save(newUser);
    }
}