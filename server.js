const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

const app = express()

app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

//
// const wordGuess = {
//   letter:
// }

app.get('/', (request, response) => {
  response.send('Hello!!')
})

app.listen(3000, () => {
  console.log('Somethings in the water!!!')
})
