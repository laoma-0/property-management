package com.propertymanagement.test;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@AutoConfigureRestDocs(outputDir = "target/snippets")
public class YourControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testApi() throws Exception {
        this.mockMvc.perform(get("/your-api-url"))
                .andExpect(status().isOk())
                .andDo(document("your-api"));
    }
}