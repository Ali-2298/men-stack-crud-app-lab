require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
})

const Plant = mongoose.model('Plant', plantSchema)

app.get('/', (req, res) => {
  res.redirect('/plants')
})

app.get('/plants', async (req, res) => {
  const plants = await Plant.find()
  res.render('plants/index', { plants })
})

app.get('/plants/new', (req, res) => {
  res.render('plants/new')
})

app.post('/plants', async (req, res) => {
  await Plant.create(req.body)
  res.redirect('/plants')
})

app.get('/plants/:id', async (req, res) => {
  const plant = await Plant.findById(req.params.id)
  res.render('plants/show', { plant })
})

app.get('/plants/:id/edit', async (req, res) => {
  const plant = await Plant.findById(req.params.id)
  res.render('plants/edit', { plant })
})

app.put('/plants/:id', async (req, res) => {
  await Plant.findByIdAndUpdate(req.params.id, req.body)
  res.redirect(`/plants/${req.params.id}`)
})

app.delete('/plants/:id', async (req, res) => {
  await Plant.findByIdAndDelete(req.params.id)
  res.redirect('/plants')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
