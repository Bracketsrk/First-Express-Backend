const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors());
app.use(express.json());

const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined){
        let result = {}
        if (job != undefined) {
            result = findUserByNameJob(name, job);
        }
        else {
            result = findUserByName(name);
        }
        result = {users_list: result};
        res.send(result);
    }
    else{
        res.send(users);
    }
});

app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); 
}

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

const findUserByNameJob = (name, job) => { 
    return users['users_list'].filter( (user) => user['name'] === name && user['job'] === job); 
}


app.post('/users', (req, res) => {
    const userToAdd = req.body;
    try {
        userToAdd.id = generateUID();
        addUser(userToAdd);
        res.status(201).end();
    }
    catch (error) {
        console.log(error);
        res.status(200).end();
    }
});

function generateUID() {
    let uid = "";
    // 3 chars of lower alphabet
    for (let i = 0; i < 3; i++) {
        uid += String.fromCharCode(97 + Math.random(26));
    }
    // 3 chars of digits
    for (let i = 0; i < 3; i++) {
        uid += String.fromCharCode(48 + Math.random(10));
    }
    return uid;
}

function addUser(user){
    users['users_list'].push(user);
}


app.delete('/users/:id', (req, res) => {
    const id = req.params['id'];
    const idNum = users['users_list'].findIndex( (user) => user.id === id );
    if (users['users_list'].at(idNum).id === id) {
        users['users_list'].splice(idNum, 1);
    }
    res.status(200).end();
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
