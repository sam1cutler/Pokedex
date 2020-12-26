require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const POKEDEX = require('./pokedex.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    console.log('validate bearer token middleware running')
    
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json( {error: 'Unauthorized request'} )
    }

    // move to next middleware
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

app.get('/types', function handleGetTypes(req, res) {
    res.json(validTypes);
});

app.get('/pokemon', function handleGetPokemon(req, res) {

    let response = POKEDEX.pokemon;

    // filter by name if name query param used
    if (req.query.name) {
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        );
    }

    // filter pokemon by type if type query param present:
    if (req.query.type) {
        response = response.filter(pokemon => 
            pokemon.type.includes(req.query.type)
        );
    }

    res.send(response);
})


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});