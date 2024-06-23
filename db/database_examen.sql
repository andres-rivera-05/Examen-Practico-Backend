-- Active: 1707795232143@@127.0.0.1@5432@db_examen@public

CREATE TABLE Items (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    precio INTEGER NOT NULL,
    imagen bytea
);
