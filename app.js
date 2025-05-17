const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const musicRoutes = require('./routes/musicRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/musics', musicRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
