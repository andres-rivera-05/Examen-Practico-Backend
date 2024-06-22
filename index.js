import express from 'express';
import multer from 'multer';
import { db } from './db/conn.js';
import path from 'path';

const app = express();
const PORT = 4756;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', async (req, res) => {
  try {
    const sql = `SELECT * FROM Items`;
    const result = await db.query(sql);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

app.get('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM Items WHERE id = $1;`;
    const result = await db.query(sql, [id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

app.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, estado, categoria, precio } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    const params = [nombre, descripcion, estado, categoria, precio, imagen];
    const sql = `INSERT INTO Items
                 (nombre, descripcion, estado, categoria, precio, imagen)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING 'Insertado con exito' mensaje`;

    const result = await db.query(sql, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

app.delete('/item/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM Items WHERE id = $1 RETURNING 'Item eliminado con exito' mensaje;`;
    const result = await db.query(sql, [id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
