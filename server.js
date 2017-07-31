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
  // The word we are trying guess
  ourWord: [],
  mysteryWord: [],
  count: 8
}

let chooseWords = Math.floor(Math.random() * words.length)
hangMan.ourWord = words[chooseWords].split('')
console.log('our random number: ', chooseWords)
console.log('our word: ', hangMan.ourWord)

hangMan.mysteryWord = hangMan.ourWord.map(x => '_')

console.log(hangMan.mysteryWord)

app.get('/', (request, response) => {
  response.render('index', hangMan)
})

app.post('/', (request, response) => {
  console.log(request.body.letter)
  if (hangMan.ourWord.includes(request.body.letter)) {
    hangMan.ourWord.forEach((secretLetter, index) => {
      if (secretLetter === request.body.letter) {
        hangMan.mysteryWord.splice(index, 1, request.body.letter)
      }
    })
  } else {
    hangMan.count -= 1
    console.log(hangMan.count)
  }
  // request.checkBody('letter', 'Already Tried That Letter')
  hangMan.letter.push(request.body.letter)
  console.log(hangMan)
  response.redirect('/')
})

app.listen(3000, () => {
  console.log('Somethings in the water!!!')
})
