// radix/node-radix/index.js
const app = require('./server');
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
});
