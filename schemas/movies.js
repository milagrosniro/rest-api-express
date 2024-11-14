const z = require('zod')

const genreSchema = z.array(
    z.enum(['Action', 'Drama', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy'])
  );

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }), 
    year: z.number()
    .int({
        invalid_type_error: 'Year must be an integer'
    })
    .min(1900, {message: 'Year must be between 1900 and 2024'})
    .max(2024, {message: 'Year must be between 1900 and 2024'}), 

    director: z.string({
        invalid_type_error: 'Director must be a string',
        required_error: 'Director is required'
    }), 

    duration: z.number()
    .positive({
        invalid_type_error: 'Duration must be a positive number'
    })
    .int({
        invalid_type_error: 'Duration must be an integer number'
    }),

    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }), 
    genre: genreSchema.nonempty({
        message: 'Movue genre is required and must be an array of predefined genres'
    }), 

    rate: z.number()
    .min(0, {message: 'Year mus be between 1900 and 2024'})
    .max(10, {message: 'Year mus be between 1900 and 2024'})
    .default(5) // put this value if rate is undefined 
})

const validateMovie = (newMovie) => movieSchema.safeParse(newMovie)

const validatePartialMovie = (input) => movieSchema.partial().safeParse(input)

module.exports= { validateMovie, validatePartialMovie}