# TaskHub API 🧠✅

API RESTful desenvolvida com **Node.js**, **TypeScript** e **Express**, com autenticação via **JWT** e persistência de dados em **MongoDB**.

> Este projeto faz parte do meu portfólio de aprendizado com Node.js e TypeScript. Fique à vontade para explorar, utilizar e sugerir melhorias!

## 🔧 Tecnologias Utilizadas

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Dotenv
- Bcrypt

## 📌 Funcionalidades

- ✅ Registro de usuários com senha criptografada
- ✅ Login com geração de token JWT
- ✅ CRUD completo de tarefas (Create, Read, Update, Delete)
- ✅ Rotas protegidas por autenticação
- ✅ Filtro de tarefas por status (Obs: Implementação já criada para utilização de diversos filtros)
- ✅ Paginação de consultas
- ✅ Recorrência de tarefas
- ⏳ Construção do swagger

### Pré-requisitos

- Node.js v18+
- MongoDB local ou em nuvem

## 🚀 Como Executar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/taskhub-api.git
cd taskhub-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo .env

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskhub
JWT_SECRET=sua_chave_secreta
```

### 4. Inicie a aplicação

### Rodar em desenvolvimento

```bash
npm run dev
```

### Build para produção

```bash
npm run build
npm start
```

---

## 🙋‍♂️ Autor

Feito com 💻 por **Caio Henrique**  
[![GitHub](https://img.shields.io/badge/GitHub--black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Caio-Henrique3)
[![LinkedIn](https://img.shields.io/badge/LinkedIn--blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/caio-henrique-56b713200)