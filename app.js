const express = require('express');
const app = express();
const addressRoutes = require('./routes/addressRoutes');
const cors = require('cors'); // Importa el módulo 'cors'

app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors());

// Rutas
app.use('/api/addresses', addressRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
