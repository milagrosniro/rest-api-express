const express = require('express')
const crypto = ('node:crypto')
const movies = require('./movies.json')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

const PORT = process.env.PORT ?? 1234

app.options('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
    res.send(200)
})

app.use(express.json())
app.use(cors())
app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({message: 'Hi World!'})
})

app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*') // Allow CORS
    const { genre } = req.query
    if(genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLocaleLowerCase() === genre.toLocaleLowerCase())
        )

        res.json(filteredMovies)
    }else{

        res.json(movies)
    }
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    movie ? res.json(movie) : res.status(404).json({message: 'Movie not found'})
})

app.post('/movies', (req, res) => {

    const result = validateMovie(req.body)

    if(result.error) return res.status(400).json({message: JSON.parse(result.error.message)})

    const newMovie = {
        id: crypto.randomUUID,
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {

    const { id } = req.params
    const result = validatePartialMovie(req.body)
    if(result.error) return res.status(400).json({message: JSON.parse(result.error.message)})
    const movieIndex = movies.findIndex(m => m.id === id)
    if(movieIndex === -1) return res.send(404).json({message: 'Movie not found'})

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie
    

    return res.json(movies[movieIndex])
    

})

app.delete('/movies/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })

app.listen(PORT, () => {
  console.log('server listening on port http://localhost:1234')
})