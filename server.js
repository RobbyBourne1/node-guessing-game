const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const words = require('./words')
const app = express()

app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

// console.log(words)

const chooseLetters = {
  letter: []
}

app.get('/', (request, response) => {
  // let chooseWords = Math.floor(Math.random() * words.length)
  // let ourWord = words[chooseWords]
  // console.log('our random number: ' + chooseWords)
  // console.log('our word: ' + ourWord)
  // request.checkBody('ourWord', 'Here is  our word')
  response.render('index', { chooseLetters: chooseLetters })
})

app.post('/', (request, response) => {
  request.checkBody('letter', 'Already Tried That Letter')
  let chooseWords = Math.floor(Math.random() * words.length)
  let ourWord = words[chooseWords]
  console.log('our random number: ' + chooseWords)
  console.log('our word: ' + ourWord)
  chooseLetters.letter.push(request.body.letter)

  console.log(chooseLetters)
  response.redirect('/')
})

// app.post('/guesses/:letter', (request, response) =>{
//
// })

app.listen(3000, () => {
  console.log('Somethings in the water!!!')
})
