const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const PORT = 3030;
const httpServer = require('http').createServer;
const io = require('socket.io')(httpServer, {
    cors: { origin: '*'},
});
const Contenedor = require("./Contenedor");
const contenedor = new Contenedor("products.json");

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));

app.set("view engine", "hbs");
app.set("views", "./views");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

let chat = [
    {
      email:"admin@admin.com",
      message:"Wellcome",
      date: new Date().toLocaleDateString()
    }
  ]
  
app.get("/", (req, res) => {
    const productos = contenedor.getAll();
    res.render('productlist', { products: productos, productsExist: true });
});

io.on('connection',(socket) => {
  console.log('New connection');
  io.socket.emit('products', productos);
  io.socket.emit('chat', chat);


  socket.on('newMessage', (msg) => {
    chat.push(msg);
    io.socket.emit('chat', chat);
  });

  socket.on('addProduct', (data) => {
    productos.push(data);
    io.socket.emit('products', productos);
  });

})


const server = app.listen(PORT, () => {
    console.log(`Servidor http iniciado en el puerto ${server.address().port}`);
});



