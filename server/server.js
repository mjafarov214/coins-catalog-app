const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const fs = require('fs');
const randomString = require('./randomString');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let users = [];
let tokens = [];

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456demon!',
    database: 'coins'
})

function checkCredentials(req) {
    const userLogin = req.body.login;
    const userPass = req.body.pass;
    //console.log(users);
    const user = users.find(u => u.login === userLogin);
    if (!user) {
        return false;
    }
    const salt = user.salt;
    const hash = bcrypt.hashSync(userPass, salt);
    if (user.hash === hash) {
        return true;
    } else {
        return false;
    }
}

function checkToken(req) {
    const userToken = req.body.token;
    if(!userToken) {
        return false;
    }
    const ourToken = tokens.find(t => t.token === userToken);
    if(!ourToken) {
        return false;
    } else {
        return true;
    }
}

app.post('/register', (req, res) => {
    const salt = bcrypt.genSaltSync(9);
    const hash = bcrypt.hashSync(req.body.pass, salt);
    const user = {
        login: req.body.login,
        salt: salt,
        hash: hash
    };
    // Check that user not exists
    users.push(user);
    res.json({ login: user.login });
});


app.post('/token', (req, res) => {
    if (!checkCredentials(req)) {
      res.sendStatus(401);
    } else {
      const newToken = randomString();
      const login = req.body.login;
      // Remove old token
          tokens.push({ login: login, token: newToken });
          res.json({ login: login, token: newToken });
    }
  });


app.post('/logout', (req, res) => {
    if (!checkToken(req)) {
        res.sendStatus(401);
    } else {
        tokens = tokens.filter((el)=>{ return el.token !== req.body.token})
        res.sendStatus(200);
    }
});


app.get('/coins', (req, res) => {
    pool.query(`SELECT ID, country , face_value , image_src , image_src_rever , name
    , metal , firstPar , price , quality , secondPar , typeCoin , weight , year, views FROM coins`, (err, data) => {
        if (err) {
            res.status(500);
        } else if(!data.length){
            res.status(404);
        }else {
            res.json(data);
            res.status(200);
        }
    });
});

app.get('/coins/:typeCoin', (req, res) => {
    pool.query(`SELECT ID, country , face_value , image_src , image_src_rever , name
    , metal , firstPar , price , quality , secondPar , typeCoin , weight,views FROM coins WHERE typeCoin = '${req.params.typeCoin}'`, (err, data) => {
        if (err) {
            res.status(500);
        } else if(!data.length){
            res.status(404);
        }else {
            res.json(data);
            res.status(200);
        }
    });
});

app.post('/search/:typeCoin', (req, res) => {
    pool.query(`SELECT ID, country , face_value , image_src , image_src_rever , name
    , metal , firstPar , price , quality , secondPar , typeCoin , weight,views FROM coins 
        WHERE (name LIKE '%${req.body.inputValue}%' OR firstPar LIKE '%${req.body.inputValue}%' 
        OR secondPar LIKE '%${req.body.inputValue}%') AND typeCoin='${req.params.typeCoin}' ORDER BY name, firstPar,secondPar`
        , (err, data) => {
            if (err) {
                res.sendStatus(500);

            } else if(!data.length){
                res.sendStatus(404);
            }else {
                res.status(200).json(data);
            }
    });
});

app.post('/search/:typeCoin', (req, res) => {
    pool.query(`SELECT ID, country , face_value , image_src , image_src_rever , name
    , metal , firstPar , price , quality , secondPar , typeCoin , weight,year,views FROM coins 
        WHERE (name LIKE '%${req.body.inputValue}%' OR firstPar LIKE '%${req.body.inputValue}%' 
        OR secondPar LIKE '%${req.body.inputValue}%') AND typeCoin='${req.params.typeCoin}' ORDER BY name, firstPar,secondPar`
        , (err, data) => {
            if (err) {
                res.sendStatus(500);

            } else if(!data.length){
                res.sendStatus(404);
            }else {
                res.status(200).json(data);
            }
    });
});

app.post('/search', (req, res) => {
    pool.query(`SELECT ID, country , face_value , image_src , image_src_rever , name
    , metal , firstPar , price , quality , secondPar , typeCoin , weight,year,views  FROM coins 
        WHERE (name LIKE '%${req.body.inputValue}%' OR firstPar LIKE '%${req.body.inputValue}%' 
        OR secondPar LIKE '%${req.body.inputValue}%') ORDER BY name, firstPar,secondPar`
        , (err, data) => {
            if (err) {
                res.sendStatus(500);

            } else if(!data.length){
                res.sendStatus(404);
            }else {
                res.status(200).json(data);
            }
    });
});

app.get('/coin/:ID', (req, res) => {
    const sql = `SELECT ID, country , face_value , image_src , image_src_rever , name
    , metal , firstPar , price , quality , secondPar , typeCoin , weight , year, views
    FROM coins WHERE ID = ?`;
    const sqlUpdate = `UPDATE coins SET views = views + 1 WHERE ID = ?`;
    pool.query(sql, [req.params.ID], (err, data) => {
        pool.query(sqlUpdate, [req.params.ID], (err) => {
            if(!err){
                res.json(data);
                res.status(200);
            }else{
                res.sendStatus(500);
            }
        })
    });
});

app.post('/coin/add',(req,res)=>{
    if (!checkToken(req)) {
        res.sendStatus(401);
      }else{
        const sql = `INSERT INTO coins
        (country , face_value , image_src , image_src_rever , name
            , metal , firstPar , price , quality , secondPar , typeCoin , weight , year,views)VALUES
        ('${req.body.country}', '${req.body.face_value}', '${req.body.image_src}', '${req.body.image_src_rever}'
        , '${req.body.name}', '${req.body.metal}', '${req.body.firstPar}', ${req.body.price}
        , '${req.body.quality}', '${req.body.secondPar}', '${req.body.typeCoin}', ${req.body.weight}
        , ${req.body.year},0)`
        pool.query(sql, (err, data) => {
            if (!err) {
                res.status(200);
                res.json(data);
            } else {
                res.sendStatus(500);
            }
        });
    }
})

app.delete('/coin/delete/:ID',(req,res)=>{
    if (!checkToken(req)) {
        res.sendStatus(401);
    }else{
        const sql = `DELETE FROM coins WHERE ID=?`;
        pool.query(sql,[req.params.ID],(err,data)=>{
            if (err) {
                res.sendStatus(500);
            } else {
                res.status(200);
                res.json(data);
            }
        });
    }
});

app.put('/coin/edit/:ID',(req,res)=>{
    if (!checkToken(req)) {
        res.sendStatus(401);
    }else{
        const sql = `UPDATE coins
        SET country = '${req.body.country}', face_value = '${req.body.face_value}' ,
        image_src = '${req.body.image_src}' , image_src_rever = '${req.body.image_src_rever}' , name = '${req.body.name}'
        , metal = '${req.body.metal}' , firstPar = '${req.body.firstPar}' , price = ${req.body.price} ,
        quality = '${req.body.quality}' , secondPar = '${req.body.secondPar}' , typeCoin = '${req.body.typeCoin}' ,
        weight = ${req.body.weight} , year = ${req.body.year}
        WHERE ID=?`;
        pool.query(sql,[req.params.ID],(err,data)=>{
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json(data);
            }
        });
    }
});



app.listen(3002,()=>console.log('server is running'))