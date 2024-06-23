import express from 'express';
import multer from 'multer';
import { db } from './db/conn.js';
import cors from 'cors';

const app = express();
const PORT = 4756;

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para parsear JSON
app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Endpoint para obtener todos los items
app.get('/', async (req, res) => {
  try {
    const sql = `SELECT * FROM Items`;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ mensaje: err.message });
  }
});

// Endpoint para obtener un item por id
app.get('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM Items WHERE id = $1;`;
    const result = await db.query(sql, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ mensaje: err.message });
  }
});

// Endpoint para crear un nuevo item
app.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, estado, categoria, precio } = req.body;
    let imagen = null;

    console.log('Body:', req.body); // Verifica qué está llegando en el cuerpo de la solicitud

    if (req.file) {
      // Obtener el buffer de la imagen
      imagen = req.file.buffer;

      // Verificar el tamaño y tipo de la imagen
      console.log('Tamaño de la imagen:', imagen.length);
      console.log('Tipo de la imagen:', req.file.mimetype);
    } else {
      console.log('No se recibió imagen');
    }

    const params = [nombre, descripcion, estado === 'true', categoria, parseInt(precio), imagen];
    const sql = `INSERT INTO Items
                (nombre, descripcion, estado, categoria, precio, imagen)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await db.query(sql, params);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ mensaje: err.message });
  }
});

// Endpoint para eliminar un item por id
app.delete('/item/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM Items WHERE id = $1 RETURNING 'Item eliminado con exito' mensaje;`;
    const result = await db.query(sql, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ mensaje: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
