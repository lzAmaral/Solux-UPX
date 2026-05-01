package com.solux.api.controller;

import com.solux.api.dto.RateioMensalDTO;
import com.solux.api.service.RateioMensalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rateios")
@RequiredArgsConstructor
public class RateioMensalController {

    private final RateioMensalService rateioMensalService;

    @GetMapping
    public ResponseEntity<List<RateioMensalDTO>> listar() {
        return ResponseEntity.ok(rateioMensalService.listarTodos());
    }
}
