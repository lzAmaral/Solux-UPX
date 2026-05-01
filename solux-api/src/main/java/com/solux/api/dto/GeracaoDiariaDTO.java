package com.solux.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeracaoDiariaDTO {
    private String timestamp; // formatted date string
    private String energiaGeradaDiariaKwh;
    private Long idUsina;
    private String nomeUsina;
}
