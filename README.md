# Solux Energy - Sistema de Gestão de Energia Solar (UPX)

![Solux Dashboard](https://img.shields.io/badge/Status-Desenvolvimento-green)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.4-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%2019-blue)
![Vite](https://img.shields.io/badge/Build-Vite-purple)

O **Solux Energy** é uma plataforma SaaS projetada para automatizar o processo de rateio de créditos de energia solar e gestão de clientes. O sistema substitui planilhas manuais por um motor de cálculo automatizado, oferecendo dashboards intuitivos tanto para administradores quanto para clientes finais.

---

## 🚀 Estrutura do Projeto

O repositório está dividido em dois módulos principais:

- **`solux-api/`**: Backend robusto construído com **Java 17** e **Spring Boot**.
  - Gerenciamento de Clientes, Usinas e Unidades Consumidoras.
  - Motor de cálculo de rateio de créditos.
  - Exportação de relatórios em CSV.
  - Segurança via Spring Security (Basic Auth).
  - Banco de dados PostgreSQL com migrações via Flyway.

- **`solux-web/`**: Frontend moderno e responsivo construído com **React** e **Vite**.
  - Dashboard Admin: Visão geral da geração, gestão de clientes e exportações.
  - Dashboard Cliente: Acompanhamento de economia, créditos e relatórios mensais.
  - UI baseada em TailwindCSS e Lucide React para ícones.
  - Gráficos interativos com Recharts.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.4**
- **Spring Security** (Autenticação e Autorização)
- **Spring Data JPA**
- **Flyway** (Gerenciamento de Database)
- **PostgreSQL** (Banco de Dados)
- **Lombok** (Produtividade)

### Frontend
- **React 19**
- **Vite**
- **TailwindCSS**
- **React Router Dom**
- **Axios** (Integração com API)
- **Recharts** (Gráficos)
- **Lucide React** (Ícones)

---

## 🔧 Configuração e Instalação

### Pré-requisitos
- JDK 17+
- Node.js 18+
- PostgreSQL rodando localmente

### 1. Backend (solux-api)
Entre na pasta do backend e configure as propriedades em `src/main/resources/application.properties`:
```bash
cd solux-api
# Verifique as credenciais do banco de dados
mvn spring-boot:run
```

### 2. Frontend (solux-web)
Entre na pasta do frontend e instale as dependências:
```bash
cd solux-web
npm install
npm run dev
```
Acesse o sistema em: `http://localhost:5173`

---

## 🔑 Credenciais de Acesso (Desenvolvimento)

Para facilitar o teste inicial, utilize as seguintes credenciais (Role Admin):
- **E-mail:** `admin@solux.com`
- **Senha:** `admin123`

Para simular o perfil de cliente:
- **E-mail:** `cliente@solux.com`
- **Senha:** `qualquer_senha`

---

## 📝 Funcionalidades Principais

- [x] Automação de Rateio de Créditos Solar.
- [x] Dashboard Admin com KPIs de geração e economia total.
- [x] Gestão completa de clientes e UCs (Unidades Consumidoras).
- [x] Dashboard Cliente com histórico de economia e créditos injetados.
- [x] Exportação de relatórios financeiros em CSV.
- [x] Interface moderna com Dark Mode automático.

---

## 🎓 Projeto Acadêmico (UPX)
Este projeto faz parte da Unidade Curricular de Projeto por Experiência (UPX).

**Desenvolvido por:** [Luiz Amaral](https://github.com/lzAmaral)
