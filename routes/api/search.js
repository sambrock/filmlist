const axios = require('axios');

const { getMovieSearchArrDetails } = require('../../utils');

const baseURL = process.env.BASE_URL;
const api_key = process.env.API_KEY;

const searchRoutes = async (fastify) => {
  fastify.get('/', async (req, reply) => {
    try {
      const query = req.query.q;

      const url = `/search/movie?api_key=${api_key}&query=${query}`;
      const { data } = await axios.get(baseURL + url);

      const movies = getMovieSearchArrDetails(data.results);

      reply.send(movies.slice(0, 6));
    } catch (error) {
      reply.status(400).send(error);
    }
  });
};

module.exports = searchRoutes;
