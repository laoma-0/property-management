package com.propertymanagement.test;
import com.propertymanagement.model.LoginRequest;
import com.propertymanagement.model.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
public class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testRegisterAndLogin() throws Exception {
        // 注册请求
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("test_user");
        registerRequest.setPassword("test_password");
        registerRequest.setPhone("123456789");
        registerRequest.setEmail("test_user@example.com");
        registerRequest.setRole("USER");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(registerRequest)))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());

        // 登录请求
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("test_user");
        loginRequest.setPassword("test_password");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(loginRequest)))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    private static String asJsonString(final Object obj) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}