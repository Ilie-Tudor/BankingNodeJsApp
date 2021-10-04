const { json } = require('body-parser');
const express = require('express');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

function GetUser(id){
    let allUsers = fs.readFileSync('./DB/users.json');
    if(allUsers!=''){
        allUsers = JSON.parse(allUsers);
        return allUsers.filter(user=>user.id==id)[0];
    } 
    return undefined;
}
function GetAllUsers(){
    let allUsers = fs.readFileSync('./DB/users.json');
    if(allUsers!=''){
        allUsers = JSON.parse(allUsers);
        return allUsers;
    } 
    return undefined;
}
function WriteUsers(users){   
    fs.writeFileSync('./DB/users.json',JSON.stringify(users));
}
function GetDeposit(iban, userid){
    let user = GetUser(userid);
    let deposit = user.deposits.filter(dep=>dep.iban==iban)[0];
    return deposit;
}
function RedirectToLogin(req,res,next){
    if(!req.session.userId){
        res.redirect('/login');
    }
    else{
        next();
    }
}
function RedirectToHome(req,res,next){
    if(req.session.userId){
        res.redirect('/');
    }
    else{
        next();
    }
}

app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'mysecretforsession',
    cookie: {
        sameSite: true,
        secure: false,
    }
}))

app.use(express.static("./public/static"));
app.use(express.urlencoded({
    extended: true
}));
app.set("views", path.join(__dirname,'public/views'));
app.set("view engine", 'ejs');

app.get('/', RedirectToLogin, (req,res)=>{
    let user = GetUser(req.session.userId);
    res.render('index.ejs',{user});
});
app.get('/transfer',RedirectToLogin,(req,res)=>{
    let user = GetUser(req.session.userId);
    res.render('transfer.ejs', {user});
});
app.get('/locations', (req,res)=>{
    let locations = JSON.parse(fs.readFileSync('./DB/locations.json'));
    let user = GetUser(req.session.userId);
    res.render('locations.ejs', {user,locations});
})
app.get('/register',RedirectToHome,(req,res)=>{
    let errMsg = undefined;
    res.render('register.ejs',{errMsg});
})
app.get('/login',RedirectToHome,(req,res)=>{
    let errMsg = [];
    res.render('login.ejs',{errMsg});
})
app.get('/depositView/:iban', RedirectToLogin, (req,res)=>{
    let deposit = GetDeposit(req.params.iban,req.session.userId);
    console.log("d:", deposit);
    let user = GetUser(req.session.userId);
    res.render('depositView.ejs',{user,deposit});
})
app.get('/newDeposit', RedirectToLogin, (req, res)=>{
    let user = GetUser(req.session.userId);
    res.render('newDeposit.ejs',{user});
});

app.post('/api/login',RedirectToHome,(req,res)=>{
    let allUsers = fs.readFileSync('./DB/users.json');
    let errMsg = ['Datele de autentificare sunt incorecte'];
    if(allUsers!=''){
        allUsers = JSON.parse(allUsers);
        loggedUser = allUsers.filter(user=>((user.email == req.body.emailOrUsername || user.username==req.body.emailOrUsername) && user.password==req.body.password))[0];
        if(loggedUser){
            req.session.userId=loggedUser.id;
            res.redirect('/');
        }
        else{
            res.render('login.ejs',{errMsg});
        }
    } 
    else{
        res.render('login.ejs',{errMsg});
    }
});
app.post('/api/register',RedirectToHome,(req,res)=>{
    let obj = fs.readFileSync('./DB/users.json');
    let errMsg = [];
    if(obj!='')     obj = JSON.parse(obj);
    else     obj = [];
    let generateUniqueID = ()=>{
        return uuidv4();
    } 
    let verifyUser = (newUser,oldUsers)=>{
        if(oldUsers.length == 0) return true;
        if(newUser.password!=newUser.retype)
        {
            errMsg.push("Parola si Retype-ul nu corespund");
            
        }
        for(user of oldUsers){
            if(user.email == newUser.email)
            {
                errMsg.push("email deja folosit");
            }
            if(user.username == newUser.username){
                errMsg.push("username deja folosit");
            }
            user.deposits.forEach(deposit => {
                if(deposit.iban == newUser.iban){
                    errMsg.push("iban deja folosit");
                }
            });
        }
        if(errMsg.length != 0) return false;
        return true;
    }
    if(verifyUser(req.body,obj)){
        let newUser;
        let uid = generateUniqueID();
        newUser = {
            id: uid,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            deposits:[
                {
                    name: req.body.depositName,
                    iban: req.body.iban,
                    credit: 1000,
                    cards: []
                }
            ]
        }
        obj = [...obj, newUser]
        fs.writeFileSync('./DB/users.json',JSON.stringify(obj));
        res.redirect("/login");
    }
    else{
        res.render('register.ejs', {errMsg});
    }
});
app.post('/api/logout', RedirectToLogin,(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.redirect('/');
        res.clearCookie('sid');
        res.redirect('/login');
    })
});
app.post('/api/transfer', RedirectToLogin,(req,res)=>{
    let allUsers = GetAllUsers();
    let ok = false;
    allUsers.forEach((user)=>{
        if(user.id == req.session.userId){
            user.deposits.forEach((dep)=>{
                if(dep.iban.trim()==req.body.senderIban.trim()){
                    if(dep.credit>=parseInt(req.body.amount)){
                        allUsers.forEach((ruser)=>{
                            ruser.deposits.forEach((rdep)=>{
                                if(rdep.iban==req.body.receiverIban){
                                    rdep.credit+=parseInt(req.body.amount);
                                    dep.credit-=parseInt(req.body.amount);
                                    ok = true;
                                    res.json({send: true,msg:"Tranzactie realizata cu succes"}); 
                                }
                            });
                        })
                        if(!ok){
                            res.json({send: false,msg:"Ibanul la care doriti sa trimiteti nu exista"});
                        }
                    }
                    else{
                        res.json({send: false,msg:"Nu aveti fonduri suficiente"});
                    }
                }
            })
        }
    });
    WriteUsers(allUsers);
});
app.post('/api/newDeposit', RedirectToLogin, (req,res)=>{
    let newDeposit = {  name: req.body.depositName,
                        iban: req.body.iban,
                        credit: req.body.credit,
                        cards: []};
    let users = GetAllUsers()
    for(let i=0;i<users.length;i++){
        if(users[i].id==req.session.userId){
            users[i].deposits.push(newDeposit);
            break;
        }
    }
    WriteUsers(users);
    res.redirect('/');
});




app.use(function(req,res){
    res.status(404).render('404page');
});
app.listen(PORT, ()=>{console.log("Server started on port: ", PORT)});

