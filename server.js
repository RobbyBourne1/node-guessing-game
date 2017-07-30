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

const hangMan = {
  letter: [],
  ourWord: [],
  mysteryWord: []
}

let chooseWords = Math.floor(Math.random() * words.length)
hangMan.ourWord.push(words[chooseWords])
console.log('our random number: ' + chooseWords)
console.log('our word: ' + hangMan.ourWord)

mysteryWord = hangMan.ourWord.map(x => {
  return (x = '_')
})

console.log(mysteryWord)

app.get('/', (request, response) => {
  response.render('index', { hangMan: hangMan })
})

app.post('/', (request, response) => {
  request.checkBody('letter', 'Already Tried That Letter')

  hangMan.letter.push(request.body.letter)

  console.log(hangMan)
  response.redirect('/')
})

// app.post('/guesses/:letter', (request, response) =>{
//
// })

app.listen(3000, () => {
  console.log('Somethings in the water!!!')
})
