const express = require('express');
const app = express()
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
// app.use(morgan('tiny'))
// Define a custom token for Morgan to log the request for POST bodies
morgan.token("request.body", (request) => {
  if  (request.method === 'POST') {
    return JSON.stringify(request.body)
  } else {
    return null
  }
})

// Middleware
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request.body'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req[body]'))

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Fanculo Ettore!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
  
  app.get('/info', (request, response) => {
    response.send(`<h3>Phonebook has ${persons.length} persons<br />${new Date()}</h3>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
    response.json(person)
    } else {
    response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.send(`Person with id ${id} has been deleted`)
    // response.status(204).end()
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    body.id = generateId()
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }

    const existingName =persons.find(person => person.name === body.name)

    if (existingName) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    persons = persons.concat(body)
    response.status(201).send(persons)
  
  })

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })