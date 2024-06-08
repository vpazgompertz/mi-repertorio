import express from 'express';
import {logger} from 'logger-express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const PORT = 3000;

const app = express();
app.use(cors())
app.use(express.json())
app.use(logger());

const __dirname = path.resolve()

//HOME
app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/index.html')
});

//GET MUESTRA LAS CANCIONES
app.get('/canciones', (req, res) => {
    try {
      const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
      res.status(200).json(canciones);
    } catch (error) {
      res.status(500).json({ message: "no está disponible" });
    }
});

//POST 
app.post('/canciones', (req, res) => {
    try {
      const cancion = req.body;
      const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
      canciones.push(cancion);
      fs.writeFileSync('repertorio.json', JSON.stringify(canciones)); 
      res.status(201).send('canción agregada');
    } catch (error) {
      res.status(500).json({ message: 'error: ' + error.message });
    }
  });

//PUT  
app.put('/canciones/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cancion = req.body;
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
        const index = canciones.findIndex(song => song.id == id);

        canciones[index] = cancion;
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
        res.status(200).send('canción actualizada');
    } catch (error) {
        res.status(500).json({ message: 'error: ' + error.message });
    }
});

//DELETE
app.delete('/canciones/:id',(req, res) => {
    const { id } = req.params
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'))
    const index = canciones.findIndex(p => p.id == id)
    canciones.splice(index, 1)
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones))
    res.send("Canción eliminada")
})


app.all('*', (req, res) =>{
    res.status(404).send('not found');
}
)


app.listen(PORT, () => {
  console.log(`Servidor encendido http://localhost:${PORT}`);
});
