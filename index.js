require('dotenv').config()
const port = process.env.PORT || 8000

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
    polls.create(data).then(poll=>res.send(poll))
})

app.get('/enter/:id', (req, res)=>{
    polls.findOne({_id: req.params.id}).then(data=>res.send(data)).catch(err=>res.send('Data not found'))
})

app.get('/update/:poll/:option', (req, res)=>{
    polls.findOne({_id: req.params.poll}).then(data=>{
        let newOptions = data.options.map(option=>option._id==req.params.option ? {opt: option.opt, votes: option.votes+1, _id: option._id} : option)
        polls.findOneAndUpdate({_id: req.params.poll}, {topic: data.topic, options: newOptions}, {new: true}).then(updatedData=>res.send(updatedData)).catch(err=>res.send('Could not update'))
    })
    /* polls.findOne({_id: req.params.poll}).then(data=>{
        let newOptions = data.options.map(option=>option._id==req.params.option ? {opt: option.opt, votes: option.votes+1} : option)
        polls.findOneAndUpdate({_id: req.params.poll}, {topic: data.topic, newOptions}).then(re.send('Updated!')).catch(err=>res.send('Could not update'))
    }).catch(err=>res.send('Data not found')) */
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})