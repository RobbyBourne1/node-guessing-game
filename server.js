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
app.use(
  expressValidator({
    customValidators: {
      sameValue: (request, response) => {}
    }
  })
)

// console.log(words)

const hangMan = {
  letter: [],
  // The word we are trying guess
  ourWord: [],
  mysteryWord: [],
  count: 8,
  message: []
}

let chooseWords = Math.floor(Math.random() * words.length)
hangMan.ourWord = words[chooseWords].split('')
// console.log('our random number: ', chooseWords)
console.log('our word: ', hangMan.ourWord)

hangMan.mysteryWord = hangMan.ourWord.map(x => '_')

console.log(hangMan.mysteryWord)

app.use(
  expressValidator({
    customValidators: {
      sameValue: () => {
        hangMan.letter.forEach(character => {
          if (character === hangMan.letter) {
            hangMan.letter.pop()
          }
        })
      }
    }
  })
)

app.get('/', (request, response) => {
  response.render('index', hangMan)
})

app.post('/', (request, response) => {
  let letterGuess = request.body.letter.toLowerCase()

  request.checkBody('letter', 'Please guess a letter').isAlpha().isLength(1, 1).notEmpty().sameValue()

  const errors = request.validationErrors()

  if (hangMan.ourWord.includes(letterGuess)) {
    hangMan.message = ''
    hangMan.letter.push(letterGuess)
    hangMan.ourWord.forEach((secretLetter, index) => {
      if (secretLetter === letterGuess) {
        hangMan.mysteryWord.splice(index, 1, letterGuess)
      }
    })
  } else {
    hangMan.message = ''
    hangMan.count -= 1
    hangMan.letter.push(letterGuess)
  }
  if (errors) {
    hangMan.letter.pop()
    hangMan.message = 'Please type in a single letter'
    hangMan.count += 1
  }
  if (hangMan.mysteryWord.join('') === hangMan.ourWord.join('')) {
    hangMan.message = 'Hooray you won!!!! You are the BOMB DIGGITY!!!'
  } else if (hangMan.count <= 0) {
    hangMan.message = `Sorry you lose, the word was ${hangMan.ourWord.join('')}`
  }
  response.redirect('/')
})

app.listen(3000, () => {
  console.log('Somethings in the water!!!')
})
