const express = require('express');
const app = express();
const Contenedor = require('./Contenedor');
const contenedor = new Contenedor('products.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

const server = app.listen(8080, () => {
  console.log(`Servidor http iniciado en el puerto ${server.address().port}`);
});
server.on('error', (error) => {
  console.log(`Error en el servidor ${error}`);
});

app.get('/', (req, res) => {
  res.render('pages/formulario.ejs');
});

app.post('/productos', async (req, res) => {
  const { body } = req;
  const { title, price, thumbnail } = body;
  const producto = { title, price: parseInt(price), thumbnail };
  await contenedor.save(producto);
  res.redirect('/');
});

app.get('/productos', async (req, res) => {
  const productos = await contenedor.getAll();
  if (productos.length !== 0) {
    res.render('pages/listadoProductos.ejs', { productos });
  } else {
    res.render('pages/sinProductos.ejs');
  }
});
