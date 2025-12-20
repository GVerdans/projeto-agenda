require('dotenv').config();

// Express configs to run server.
const express = require('express');
const app = express();
const port = 3000;

// const tudo do DB \/
const mongoose = require('mongoose');

// Connection to DB
mongoose.connect(process.env.connectionstring)
.then(() => {
    console.log('DB Connected !');
    // Aqui no caso, quando retornar a promise sem erros. O express vai emitir um 'ready'.
    app.emit('ready');
})
.catch(e => console.log('Erro ao Conectar DB: ' + e));

const session = require('express-session'); // Inicialzação das Sessions.
const MongoStore = require('connect-mongo'); // Sessões salvos no DB.
const flash = require('connect-flash'); // Flash Messages

const routes = require('./routes'); // Routes Initialization.
const path = require('path'); // __dirname, __dirfile

// lib de proteção recomedada pelo Express.
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net", // Permite Bootstrap
        "'unsafe-inline'" // Necessário para CSRF tokens inline
      ],
      styleSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "'unsafe-inline'"
      ],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false // Importante para desenvolvimento
}));

const csrf = require('csurf'); // Tokens para os form.

// Global Middleware
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');


// Quase Orbigatorio para lidar com POST, pois converte os vcalores enviados no FORM para que se possam le-los.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurando pasta com Arquivos estaticos
app.use(express.static(path.resolve(__dirname, './public')));
//                  ou path.resolve(__dirname, 'public')

// Cria a Session (No PHP é mais fácil)
const sessionOptions = session({
    secret: 'asadasadasadfafsdfghdfghd',
    store: MongoStore.create({
        mongoUrl: process.env.connectionstring
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
// This flash, is for sessions message
app.use(flash());

// Set view folder to render
app.set('views', './src/views');
// Set ejs engine to render HTML pages
app.set('view engine', 'ejs');

// This csrf, is a method for Cross-site request forgery (CSRF)security recommended by Express.
app.use(csrf());

// Meu prorpio middleware
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);




// Aqui quando o app.emit emitir o 'ready', o Express vai executar essa função de 'Ouvir oq está acontecendo'
// Isso está sendo feito para que eu só rode o server quando o DB estiver connectado.clear

app.on('ready', () => {
    app.listen(port, () => {
        console.log('Acessar: http://localhost:3000');
        console.log('Server rodando na porta 3000');
    });
})
