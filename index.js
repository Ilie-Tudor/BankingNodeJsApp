const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static("./public/static"));
app.get('/',(req,res)=>{

});
app.get('/about',(req,res)=>{
    res.send("jfdlkaj");
});

app.listen(PORT, ()=>{console.log("Server started on port: ", PORT)});

