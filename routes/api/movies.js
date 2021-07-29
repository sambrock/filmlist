const axios = require('axios');

const User = require('../../models/user');
const user = require('../../middleware/user');
const { getMovieArrDetails, getMovieDetails } = require('../../utils');

const baseURL = process.env.BASE_URL;
const api_key = process.env.API_KEY;

const movieRoutes = async (fastify) => {
  fastify.get('/default', async (req, reply) => {
    try {
      const url = `/movie/upcoming?api_key=${api_key}`;
      const { data } = await axios.get(baseURL + url);

      const movies = getMovieArrDetails(data.results);

      reply.send(movies);
    } catch (error) {
      reply.status(400).send(error);
    }
  });

  fastify.get('/:id', { preValidation: user }, async (req, reply) => {
    try {
      const url = `/movie/${req.params.id}?api_key=${api_key}&append_to_response=credits,releases`;
      const { data } = await axios.get(baseURL + url);

      const movie = getMovieDetails(data);

      if (req.user) {
        let user = await User.findOne({ username: req.user.username });

        const index1 = user.watchlist.map((w) => w.filmId).indexOf(req.params.id);
        if (index1 != -1) movie.watchlist = true;

        const index2 = user.seen.map((s) => s.filmId).indexOf(req.params.id);
        if (index2 != -1) {
          movie.rating = user.seen[index2].rating ? user.seen[index2].rating : 0;
          movie.like = user.seen[index2].like ? true : false;
        }
      }

      reply.send(movie);
    } catch (error) {
      reply.status(404).send({ id: 'MOVIE_ERROR', status: error.response.status, msg: error.response.statusText });
    }
  });
};

module.exports = movieRoutes;
