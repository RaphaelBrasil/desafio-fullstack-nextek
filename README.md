# desafio-fullstack-nextek

# Instruções para iniciar a aplicação

Este projeto é dividido em três partes: **bd**, **backend** e **frontend**. Para iniciar a aplicação, siga os passos abaixo:

## Pré-requisitos

Certifique-se de ter o seguinte instalado em sua máquina:

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   [Node.js](https://nodejs.org/) (para instalar dependências localmente, se necessário)

## Passos para inicializar o projeto

1. **Inicie os containers com o Docker Compose:**

    ```bash
    docker compose up
    ```

    > Isso irá inicializar o container do banco de dados `docker-compose.yml`.

2. **Acesse o diretório do backend:**

    ```bash
    cd backend
    ```

3. **Instale as dependências do backend:**

    ```bash
    yarn
    ```

4. **Inicie o servidor do backend:**

    ```bash
    yarn start
    ```

5. **Volte para o diretório raiz e acesse o frontend:**

    ```bash
    cd ..
    cd frontend
    ```

6. **Instale as dependências do frontend:**

    ```bash
    yarn
    ```

7. **Inicie o servidor de desenvolvimento do frontend:**
    ```bash
    yarn dev
    ```

## Acessando a aplicação

Após seguir os passos acima, abra seu navegador e acesse:

[http://localhost:5173/](http://localhost:5173/)

---
