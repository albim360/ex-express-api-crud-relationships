// index.js
const express = require('express');
const app = express();
const routes = require('./routes/postRoutes');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());

app.use('/', routes);

// Route di base per la radice
app.get('/', (req, res) => {
  res.send('Benvenuto nel mio server Express!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server online su: http://localhost:${port}`);
});
