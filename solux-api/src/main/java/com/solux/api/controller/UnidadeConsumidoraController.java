package com.solux.api.controller;

import com.solux.api.dto.UnidadeConsumidoraDTO;
import com.solux.api.service.UnidadeConsumidoraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades")
@RequiredArgsConstructor
public class UnidadeConsumidoraController {

    private final UnidadeConsumidoraService unidadeConsumidoraService;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody @Valid UnidadeConsumidoraDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(unidadeConsumidoraService.salvar(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UnidadeConsumidoraDTO>> listar() {
        return ResponseEntity.ok(unidadeConsumidoraService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadeConsumidoraDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(unidadeConsumidoraService.buscarPorId(id));
    }
}
