package com.solux.api.controller;

import com.solux.api.service.ExportacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/exportacao")
@RequiredArgsConstructor
public class ExportacaoController {

    private final ExportacaoService exportacaoService;

    @GetMapping("/clientes")
    public ResponseEntity<byte[]> exportarClientes() {
        byte[] csvData = exportacaoService.exportarClientesCsv();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=clientes_exportacao.csv");
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    @GetMapping("/rateios")
    public ResponseEntity<byte[]> exportarRateios(
            @RequestParam Integer mes,
            @RequestParam Integer ano) {
        
        byte[] csvData = exportacaoService.exportarRateiosCsv(mes, ano);
        
        HttpHeaders headers = new HttpHeaders();
        String filename = String.format("rateios_%02d_%d.csv", mes, ano);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    @GetMapping("/geracao/mensal")
    public ResponseEntity<byte[]> exportarGeracaoMensal() {
        byte[] csvData = exportacaoService.exportarGeracaoMensalCsv();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=geracao_mensal.csv");
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    @GetMapping("/geracao/diaria")
    public ResponseEntity<byte[]> exportarGeracaoDiaria(@RequestParam(defaultValue = "1") Long idUsina) {
        byte[] csvData = exportacaoService.exportarGeracaoDiariaCsv(idUsina);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=geracao_diaria_simulada_usina_" + idUsina + ".csv");
        headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }


}
