const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

const app = express();

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

MongoClient.connect("mongodb+srv://lawson:Windowsxp2016@@cluster0.7vajc.gcp.mongodb.net/todolist?retryWrites=true&w=majority", 
{
    useUnifiedTopology: true
}, (err, client) => {
    if(err) return console.log(err)
    console.log('Connected to database')
    const db = client.db('todolist')
    const todoCollection = db.collection('todos')   

    
    app.get('/', (req, res) => {
        res.send('Welcome to Lagos!')
    })

    app.get('/todos', (req, res) => {
        db.collection('todos').find().toArray().then(results => {
            console.log(results)
            res.send(results)
        })
    })
    
    app.post('/create', (req, res) => {
        todoCollection.insertOne(req.body).then(result => {
            res.json(result.ops[0])
        }).catch(error => console.log(error))
    })

    app.put('/mark-item', (req, res) => {
        let obj = req.body
        todoCollection.findOneAndUpdate(
            {_id: ObjectId(obj._id)},
            {
                $set: {
                    completed: obj.completed
                }
            }
        ).then(result => {
            return res.send('Updated')
        })
    })

    app.delete('/:id', (req, res) => {
        let id = req.params.id
        todoCollection.findOneAndDelete(
            {_id: ObjectId(id)}
        ).then(result => {
            return res.send('Deleted')
        })
    })
    
})

app.listen(3000, () => {
    console.log('listening on 3000')
})
