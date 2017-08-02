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
  letter: ['r', 's', 't', 'l', 'n', 'e'],
  // The word we are trying guess
  ourWord: [],
  mysteryWord: [],
  count: 8,
  message: []
}

let easyWords = words.filter(word => word.length <= 6)
let mediumWords = words.filter(word => word.length > 6 && word.length <= 8)
let hardWords = words.filter(word => word.length > 8)

let chooseWords = Math.floor(Math.random() * words.length)
hangMan.ourWord = words[chooseWords].split('')
// console.log('our random number: ', chooseWords)
console.log('our word: ', hangMan.ourWord)

hangMan.mysteryWord = hangMan.ourWord.map(x => '_')

console.log(hangMan.mysteryWord)

app.use(
  expressValidator({
    customValidators: {
      duplicate: (param, options) => {
        // param is the incoming
        // options is an object that has other params inside of it
        //return t/f
      },
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
  // hangMan.letter.forEach((secretLetter, index) => {
  //   console.log(hangMan.ourWord)
  //   console.log(hangMan.letter)
  //   if (hangMan.ourWord.includes(secretLetter)) {
  //     hangMan.mysteryWord.splice(index, 1, secretLetter)
  //     console.log(hangMan.mysteryWord)
  //   }
  // })

  hangMan.mysteryWord = hangMan.ourWord.map(letter => {
    if (hangMan.letter.indexOf(letter) >= 0) {
      return letter
    } else {
      return '_'
    }
  })

  hangMan.letter.sort()
  response.render('index', hangMan)
})

app.post('/', (request, response) => {
  let letterGuess = request.body.letter.toLowerCase()

  request.checkBody('letter', 'Please guess a letter').isAlpha().isLength(1, 1).notEmpty().duplicate(hangMan.letter)

  const errors = request.validationErrors()

  console.log(hangMan.letter)

  // hangMan.letter.forEach((secretLetter, index) => {
  //   console.log(hangMan.ourWord)
  //   console.log(hangMan.letter)
  //   if (hangMan.ourWord.includes(secretLetter)) {
  //     hangMan.mysteryWord.splice(index, 1, secretLetter)
  //     console.log(hangMan.mysteryWord)
  //   }
  // })

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
