package com.solux.api.controller;

import com.solux.api.dto.UsinaDTO;
import com.solux.api.service.UsinaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usinas")
@RequiredArgsConstructor
public class UsinaController {

    private final UsinaService usinaService;

    @PostMapping
    public ResponseEntity<UsinaDTO> criar(@RequestBody @Valid UsinaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usinaService.salvar(dto));
    }

    @GetMapping
    public ResponseEntity<List<UsinaDTO>> listar() {
        return ResponseEntity.ok(usinaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsinaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usinaService.buscarPorId(id));
    }
}
