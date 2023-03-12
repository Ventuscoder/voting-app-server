require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

let uri = `mongodb+srv://voting-app:${process.env.PASSWORD_DB}@cluster0.bdehkf7.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(uri)

const pollSchema = mongoose.Schema({
    topic: String,
    options: [{opt: String, votes: Number}]
})

const polls = mongoose.model('Poll', pollSchema)

const app = express()

app.use(cors())
app.use(express.json())

app.post('/new', (req, res)=>{
    const data = req.body
    polls.create(data).then(a=>res.send(a))
})

app.listen(8000, ()=>{
    console.log('Server is running on port 8000')
})