require ("dotenv").config();

const express = require ("express");
const expressLayouts = require("express-ejs-layouts");
const routes = require ('./server/routes/main.js');
const connectDB = require("./server/config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { isActiveRoute } = require("./server/helpers/routeHelpers")
const methodOverride = require('method-override');

//connect to Db
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'Keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }),

}))

app.use(express.static('public'));

// Templating Engine
app.use( expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.locals.isActiveRoute = isActiveRoute; 


app.use('/', require('./server/routes/main.js'));
app.use('/', require('./server/routes/admin.js'));

app.listen(PORT, () => {
    console.log(`listening to my server start ${PORT}..`);
})