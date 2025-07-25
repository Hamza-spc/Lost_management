const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const EmployeeModel = require('./models/Employee');
const LostItemModel = require('./models/LostItem');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/employee') //connect to the database
    

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    if (!email.endsWith('@sofitel.com')) {
        return res.status(403).json({ error: 'Only @sofitel.com emails are allowed to log in.' });
    }
    EmployeeModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.json('Success');
            } else {
                res.json('The password is incorrect');
            }
        }else {
            res.json('No record existed');
        }
    })
})

app.post('/register', (req, res) => {
    const { email } = req.body;
    if (!email.endsWith('@sofitel.com')) {
        return res.status(403).json({ error: 'Only employees from sofitel are allowed to register.' });
    }
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err));   
});

app.post('/lostitems', (req, res) => {
    LostItemModel.create(req.body)
    .then(item => res.json(item))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.get('/lostitems', (req, res) => {
    LostItemModel.find()
    .then(items => res.json(items))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.patch('/lostitems/:id', (req, res) => {
    LostItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(item => res.json(item))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.delete('/lostitems/:id', (req, res) => {
    LostItemModel.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});



