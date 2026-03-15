package com.aditya.bms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LoginResponseDTO {

    private String status;
    private String message;
    private DataResponse data;

    @Data
    @AllArgsConstructor
    public static class DataResponse {

        private String accessToken;
        private Long id;
        private String username;
        private String email;
        private List<String> roles;
        private String tokenType;
    }
}
