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

const hangMan = {
  letter: ['r', 'l', 'a', 'e'],
  // The word we are trying guess
  ourWord: [],
  mysteryWord: [],
  count: 8,
  message: []
}

console.log('our word: ', hangMan.mysteryWord)

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

const getEasyWord = word => {
  let easyWords = words.filter(word => word.length > 3 && word.length < 6)
  let chooseWords = Math.floor(Math.random() * easyWords.length)
  hangMan.ourWord = easyWords[chooseWords].split('')
  console.log('our word: ', hangMan.ourWord)
}

const getMediumWord = word => {
  let mediumWords = words.filter(word => word.length >= 6 && word.length < 8)
  let chooseWords = Math.floor(Math.random() * mediumWords.length)
  hangMan.ourWord = mediumWords[chooseWords].split('')
  console.log('our word: ', hangMan.ourWord)
}

const getHardWord = word => {
  let hardWords = words.filter(word => word.length > 8)
  let chooseWords = Math.floor(Math.random() * hardWords.length)
  hangMan.ourWord = hardWords[chooseWords].split('')
  console.log('our word: ', hangMan.ourWord)
}

hangMan.mysteryWord = hangMan.ourWord.map(x => '_')

app.get('/', (request, response) => {
  response.render('Index', hangMan)
})

const gameGet = game => {
  hangMan.mysteryWord = hangMan.ourWord.map(letter => {
    if (hangMan.letter.indexOf(letter) >= 0) {
      return letter
    } else {
      return '_'
    }
  })
  if (hangMan.mysteryWord.join('') === hangMan.ourWord.join('')) {
    hangMan.message = 'Hooray you won!!!! You are the BOMB DIGGITY!!!'
  } else if (hangMan.count <= 0) {
    hangMan.message = `Sorry you lose, the word was "${hangMan.ourWord.join('').toUpperCase()}"`
  }
}

const gamePost = game => {

}



app.get('/EasyMode', (request, response) => {
  getEasyWord()
  gameGet()
  response.render('game', hangMan)
})

app.post('/EasyMode', (request, response) => {
  let letterGuess = request.body.letter.toLowerCase()
  request.checkBody('letter', 'Please guess a letter').isAlpha().isLength(1, 1).notEmpty().duplicate(hangMan.letter)

  const errors = request.validationErrors()

  if (errors) {
    hangMan.message = 'Please type in a single letter'

    response.redirect('/EasyMode')

    return
  }

  if (hangMan.ourWord.includes(letterGuess)) {
    hangMan.message = ''
    hangMan.letter.push(letterGuess)
    hangMan.ourWord.forEach((secretLetter, index) => {
      if (hangMan.ourWord === hangMan.letter) {
        hangMan.mysteryWord.splice(index, 1, letterGuess)
      }
    })
  } else {
    hangMan.message = ''
    hangMan.count -= 1
    hangMan.letter.push(letterGuess)
  }
  response.redirect('/EasyMode')
})

app.get('/MediumMode', (request, response) => {
  getMediumWord()
  gameGet()
  response.render('game', hangMan)
})

app.post('/MediumMode', (request, response) => {
  let letterGuess = request.body.letter.toLowerCase()
  request.checkBody('letter', 'Please guess a letter')
  .isAlpha()
  .isLength(1, 1)
  .notEmpty()
  .duplicate(hangMan.letter)
  const errors = request.validationErrors()

  if (errors) {
    hangMan.message = 'Please type in a single letter'

    response.redirect('/MediumMode')

    return
  }
  if (hangMan.ourWord.includes(letterGuess)) {
    hangMan.message = ''
    hangMan.letter.push(letterGuess)
    hangMan.ourWord.forEach((secretLetter, index) => {
      if (hangMan.ourWord === hangMan.letter) {
        hangMan.mysteryWord.splice(index, 1, letterGuess)
      }
    })
  } else {
    hangMan.message = ''
    hangMan.count -= 1
    hangMan.letter.push(letterGuess)
  }

  response.redirect('/MediumMode')
})

app.get('/HardMode', (request, response) => {
  getHardWord()
  gameGet()
  response.render('game', hangMan)
})

app.post('/HardMode', (request, response) => {
  let letterGuess = request.body.letter.toLowerCase()
  request.checkBody('letter', 'Please guess a letter').isAlpha().isLength(1, 1).notEmpty().duplicate(hangMan.letter)
  const errors = request.validationErrors()
  if (errors) {
    hangMan.message = 'Please type in a single letter'

    response.redirect('/HardMode')

    return
  }
  if (hangMan.ourWord.includes(letterGuess)) {
    hangMan.message = ''
    hangMan.letter.push(letterGuess)
    hangMan.ourWord.forEach((secretLetter, index) => {
      if (hangMan.ourWord === hangMan.letter) {
        hangMan.mysteryWord.splice(index, 1, letterGuess)
      }
    })
  } else {
    hangMan.message = ''
    hangMan.count -= 1
    hangMan.letter.push(letterGuess)
  }
  response.redirect('/HardMode')
})

app.listen(3000, () => {
  console.log('Somethings in the water!!!')
})
