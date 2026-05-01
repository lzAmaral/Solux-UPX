package com.solux.api.controller;

import com.solux.api.dto.GeracaoMensalDTO;
import com.solux.api.service.GeracaoMensalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geracao")
@RequiredArgsConstructor
public class GeracaoMensalController {

    private final GeracaoMensalService geracaoMensalService;

    @PostMapping
    public ResponseEntity<?> registrarERatear(@RequestBody @Valid GeracaoMensalDTO dto) {
        try {
            GeracaoMensalDTO gerado = geracaoMensalService.registrarGeracaoERatear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(gerado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<GeracaoMensalDTO>> listar() {
        return ResponseEntity.ok(geracaoMensalService.listarTodas());
    }
}
