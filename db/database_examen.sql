-- Active: 1707795232143@@127.0.0.1@5432@db_examen@public

CREATE TABLE Items (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado BOOLEAN DEFAULT True,
    categoria VARCHAR(255) NOT NULL,
    precio INTEGER NOT NULL,
    imagen bytea
);

CREATE TABLE Categoria(
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255)
)

INSERT INTO Categoria(nombre)VALUES('Herramientas');

SELECT * FROM categoria

INSERT INTO Items(nombre, descripcion, estado, categoria, precio, imagen)
VALUES ('tasa', 'tasa color negro para tomar cafe', True, 'Utensilios', 24, NULL )