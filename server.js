const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const words = require('./words')
const app = express()
const expressSession = require('express-session')

app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  expressSession({
    secret: 'Keyboard Cat',
    resave: false,
    saveUninitialized: true
  })
)

app.use(
  expressValidator({
    customValidators: {
      duplicate: (param, options) => {
        if (options.indexOf(param) < 0) {
          return '_'
        }
      }
    }
  })
)

const resetHangman = (hangMan) => {
  hangMan.letter = ['r', 'l', 'a', 'e']
  // The word we are trying guess
  hangMan.ourWord = []
  hangMan.mysteryWord = []
  hangMan.count = 8
  hangMan.messages = []
}

const getWordBetweenLengths = (hangMan, low, high) => {
  let filteredWords = words.filter(word => word.length > low && word.length < high)
  let chooseWords = Math.floor(Math.random() * filteredWords.length)
  hangMan.ourWord = filteredWords[chooseWords].split('')
  hangMan.mysteryWord = hangMan.ourWord.map(x => '_')
  console.log('word we are trying to guess: ', hangMan.ourWord)
  console.log('players word so far: ', hangMan.mysteryWord)

} 

app.get('/', (request, response) => {
  request.session.hangMan = {}

  response.render('Index', request.session.hangMan)
})

const gameGet = (hangMan, game) => {
  hangMan.mysteryWord = hangMan.ourWord.map(letter => {
    if (hangMan.letter.indexOf(letter) >= 0) {
      return letter
    } else {
      return '_'
    }
  })
  if (hangMan.mysteryWord.join('') === hangMan.ourWord.join('')) {
    hangMan.messages = ['Hooray you won!!!! You are the BOMB DIGGITY!!!']
  } else if (hangMan.count <= 0) {
    hangMan.messages = [`Sorry you lose, the word was "${hangMan.ourWord.join('').toUpperCase()}"`]
  }
}

app.get('/EasyMode', (request, response) => {
  const hangMan = request.session.hangMan

  resetHangman(hangMan)
  getWordBetweenLengths(hangMan, 3, 5)
  response.redirect('/Play')
})

app.get('/MediumMode', (request, response) => {
  const hangMan = request.session.hangMan

  resetHangman(hangMan)
  getWordBetweenLengths(hangMan, 6, 8)
  response.redirect('/Play')
})

app.get('/HardMode', (request, response) => {
  const hangMan = request.session.hangMan

  resetHangman(hangMan)
  getWordBetweenLengths(hangMan, 9, 14)
  response.redirect('/Play')
})

app.get('/Play', (request, response) => {
  const hangMan = request.session.hangMan
  
  gameGet(hangMan)
  response.render('Game', hangMan)  
})

app.post('/Attempt', (request, response) => {
  const hangMan = request.session.hangMan

  let letterGuess = request.body.letter.toLowerCase()
  request.checkBody('letter', 'Please guess a letter').isAlpha()
  request.checkBody('letter', 'Please guess a single letter').isLength(1, 1)
  request.checkBody('letter', 'You have not guesses a letter').notEmpty()
  request.checkBody('letter', 'You have already guessed that letter').duplicate(hangMan.letter)

  const errors = request.validationErrors()

  if (errors) {
    hangMan.messages = errors.map(error => error.msg)

    response.redirect('/Play')
    return
  }

  if (request.session.hangMan.ourWord.includes(letterGuess)) {
    hangMan.message = []
    hangMan.letter.push(letterGuess)
    hangMan.messages.pop()
    hangMan.ourWord.forEach((secretLetter, index) => {
      if (hangMan.ourWord === hangMan.letter) {
        hangMan.mysteryWord.splice(index, 1, letterGuess)
      }
    })
  } else {
    hangMan.message = []
    hangMan.count -= 1
    hangMan.letter.push(letterGuess)
  }
  response.redirect('/Play')
})


app.listen(3000, () => {
  console.log('Somethings in the water!!!')
})
