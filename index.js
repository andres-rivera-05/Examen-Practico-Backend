import express from 'express'
import { db } from './db/conn.js';
const app = express()
const PORT = 4756;

app.use(express.json());

app.get('/', async (req, res)=>{
  try {
    const sql = `SELECT * FROM Items`
    const result = await db.query(sql)
    res.json(result)
  } catch (err) {
    res.status(500).json({ mensaje: err.message })
  }
})

app.get('/item/:id', async (req, res)=>{
  try{
    const { id } = req.params;
    const sql = `SELECT * FROM Items WHERE id = $1;`
    const result = await db.query(sql, [id])
    res.json(result)
  }catch(err){
    res.status(500).json({mensaje: err.message})
  }
})


app.post('/', async (req, res)=>{
  try{
    const { nombre, descripcion, estado, categoria, precio, imagen } = req.body;
    const params = [nombre, descripcion, estado, categoria, precio, imagen]
    const sql = `INSERT INTO Items
              (nombre, descripcion, estado, categoria, precio, imagen)
              VALUES ($1,$2, $3, $4, $5, $6 ) RETURNING 'Insertado con exito' mensaje`

    const result = await db.query(sql, params)
    res.json(result)    
  }catch(err){
    res.status(500).json({ mensaje: err.message })
  }

})

app.delete('/item/delete/:id', async (req, res)=>{
  try {
    const { id } = req.params;
    const sql = `DELETE FROM Items WHERE id = $1 RETURNING 'Item eliminado con exito' mensaje;`;
    const result = await db.query(sql, [id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }

})



app.listen(PORT, (req, res)=>{
  console.log(`Servidor escuchando en el puerto: ${PORT}`)
})