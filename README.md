# Solux Energy - Sistema de Gestão de Energia Solar

O Solux Energy é uma plataforma SaaS desenvolvida para automatizar o processo de rateio de créditos de energia solar na modalidade de Geração Distribuída (GD). O sistema substitui o controle manual por meio de planilhas, oferecendo um motor de cálculo automatizado e painéis interativos para gestores (administradores) e beneficiários (clientes).

---

## Estrutura do Projeto

O repositório é composto por dois módulos principais:

### 1. solux-api (Backend)
Desenvolvido em Java 17 com Spring Boot 3.4. Responsável por expor a API RESTful consumida pelo frontend.
- Gerenciamento de clientes, usinas e unidades consumidoras.
- Motor de cálculo de rateio de créditos de energia (implementado em Java).
- Serviço de exportação de dados em CSV.
- Autenticação e autorização via Spring Security (Basic Auth).
- Persistência de dados com PostgreSQL e controle de versão do esquema do banco de dados utilizando Flyway.

### 2. solux-web (Frontend)
Desenvolvido em React 19 com Vite. Responsável pela interface do usuário e consumo da API.
- Dashboard Administrativo: Visão consolidada da geração de energia, gestão de clientes, rateios e exportações.
- Dashboard do Cliente: Área restrita para acompanhamento de economia acumulada, histórico de créditos injetados e relatórios.
- Landing Page (Pública): Página de conversão com um simulador de economia em tempo real, baseado na Resolução Normativa ANEEL nº 1.000/2021.
- Estilização desenvolvida com TailwindCSS.
- Visualização de dados interativa utilizando Recharts.

---

## Implementações Recentes e Melhorias

Diversas melhorias foram aplicadas para tornar a plataforma mais robusta e agregar valor real ao negócio:

1. Landing Page e Simulador de Economia: Adição de uma página pública contendo um simulador que calcula a economia projetada para o cliente com base em seu gasto mensal e na tarifa média nacional (considerando descontos regulatórios como o "Fio B").
2. Correção de Multi-tenancy: Refatoração da camada de autenticação no frontend para que cada cliente visualize exclusivamente os seus próprios dados no painel, utilizando o e-mail do usuário autenticado para realizar o vínculo no banco de dados.
3. Projeção Financeira: Implementação de cálculo de projeção anual de economia no painel do cliente, baseado na média de economia dos últimos meses.
4. Enriquecimento de Dados em Tabelas: Atualização nas rotas e na interface de rateios para exibição de nomes de clientes e números legíveis de Unidades Consumidoras em vez de IDs puros, facilitando a visualização dos dados pelo administrador.
5. Indicadores Visuais de Status: Criação de componentes de status de operação mensal e badges de "saúde do cliente" no painel administrativo, indicando se os processos e rateios estão em dia.
6. Limpeza de Interface: Remoção de elementos desnecessários (como emojis e dicas exclusivas de ambiente de simulação) visando uma interface mais profissional e limpa.

---

## Tecnologias Utilizadas

### Stack Backend
- Java 17
- Spring Boot 3.4
- Spring Security
- Spring Data JPA
- Flyway Migration
- PostgreSQL
- Lombok

### Stack Frontend
- React 19
- Vite
- TailwindCSS
- React Router Dom
- Axios
- Recharts
- Lucide React

---

## Instruções para Execução Local

### Pré-requisitos
- JDK 17 ou superior
- Node.js 18 ou superior
- Docker e Docker Compose (para o banco de dados)

### Subindo o Banco de Dados
Acesse o diretório do backend e inicie o contêiner do MySQL (utilizado localmente conforme `compose.yaml`):
```bash
cd solux-api
docker compose up -d
```

### Executando o Backend (solux-api)
Certifique-se de estar no diretório `solux-api` e inicie a aplicação Spring Boot:
```bash
./mvnw spring-boot:run
```
O serviço estará disponível na porta `8080`.

### Executando o Frontend (solux-web)
Em um novo terminal, acesse o diretório do frontend, instale as dependências e inicie o servidor de desenvolvimento:
```bash
cd solux-web
npm install
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`.

---

## Credenciais Padrão (Ambiente de Desenvolvimento)

- Acesso Administrador: `admin@solux.com` / `admin123`
- Acesso Cliente: `cliente@solux.com` / (Qualquer senha durante o ambiente de simulação)

---

## Sobre o Projeto
Este repositório faz parte da Unidade Curricular de Projeto por Experiência (UPX).
Desenvolvido por: Luiz Amaral.
