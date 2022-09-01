const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const PORT = 8080;
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: { origin: '*'},
});

const Contenedor = require("./Contenedor");
const contenedor = new Contenedor("products.json");

const Chat = require('./Chat')
let chat = new Chat('./chat.json');

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended:true}));

// PLANTILLA HANDLEBARS
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

// let chat = [
//     {
//       email:"admin@admin.com",
//       message:"Wellcome",
//       date: new Date().toLocaleDateString()
//     }
//   ]


  
//=========== VARIABLES ===========//


//const productos = contenedor.getAll();

app.get("/", (req, res) => {
  // const productos = contenedor.getAll();
  // console.log(productos)
    res.render('main', { productos });
});

io.on('connection',(socket) => {
  console.log('New connection');
  io.socket.emit('products', contenedor.getAll());
  io.socket.emit('chat', chat);


  socket.on('newMessage', (msg) => {
    chat.push(msg);
    io.socket.emit('chat', chat);
  });

  socket.on('addProduct', (data) => {
    //productos.push(data);
    const { body } = req;
    const { title, price, thumbnail } = body;
    const producto = { title, price: parseInt(price), thumbnail };
    contenedor.save(producto);

    io.socket.emit('products', contenedor.getAll());
  });

})

httpServer.listen(PORT, () => {
  console.log(`Servidor http iniciado en el puerto ${PORT}`);
});

