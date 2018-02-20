require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const session=require('express-session');
const createInitialSession=require('./middlewares/session');
let filter=require('./middlewares/filter');

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
        maxAge:10000
    }
}))

app.use(createInitialSession);
// app.use((req,res,next)=>{
//     const {method}=req;
//     method==="POST"||method==="PUT"?filter(req,res,next):next();
// })



const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, filter, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, filter, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );