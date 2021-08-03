const _ = require('lodash');

const User = require('../../models/user');
const auth = require('../../middleware/auth');
const TMDbService = require('../../services/TMDbService');
const { verifyUserRequest, getMovieArrDetails } = require('../../utils');

const userRoutes = async (fastify) => {
  fastify.post('/:username', async (req, reply) => {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return reply.status(404).send('User does not exist.');

    const { limit } = req.query;
    const { basedOn } = req.body;

    const likes = user.seen.filter((s) => s.like === true);
    if (likes.length < 3) return reply.status(400).send({ id: 'MOVIES_ERROR', msg: 'Not enough liked movies.' });

    const randomLikes = _.sampleSize(
      _.difference(
        likes.map((m) => m.filmId),
        basedOn
      ),
      2
    ); //likes.length >= 6 ? 6 : 3

    const remove = [...user.seen, ...user.watchlist, ...user.notInterested].map((m) => ({ id: m.filmId }));

    let movies = await TMDbService.getRecommendationsArr(randomLikes);
    movies = _.differenceBy(movies, remove, 'id');
    movies = _.uniqBy(movies, 'id');
    movies = movies.slice(0, limit);
    movies = getMovieArrDetails(movies);

    const hasMore = basedOn ? basedOn.length < likes.length : true;

    reply.send({ basedOn: randomLikes, hasMore, results: movies });
  });

  fastify.get('/:username/watchlist', async (req, reply) => {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return reply.status(404).send('User does not exist.');

    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const userWatchlist = user.watchlist.reverse().slice(startIndex, endIndex);
    const tmdbData = await TMDbService.getDataArr(userWatchlist.map((m) => m.filmId));
    const watchlist = getMovieArrDetails(tmdbData);

    reply.send(watchlist);
  });

  fastify.get('/:username/seen', async (req, reply) => {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return reply.status(404).send('User does not exist.');

    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const userSeen = user.seen.reverse().slice(startIndex, endIndex);
    const tmdbData = await TMDbService.getDataArr(userSeen.map((m) => m.filmId));
    const seen = getMovieArrDetails(tmdbData);

    reply.send(seen.map((m, i) => ({ ...m, rating: userSeen[i].rating, like: userSeen[i].like })));
  });

  fastify.post('/:username/watchlist', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });

    const index = user.watchlist.map((w) => w.filmId).indexOf(req.body.filmId);
    if (index > -1)
      return reply.status(400).send({ id: 'WATCHLIST_ERROR', msg: `'${req.body.title}' already in your watchlist.` });

    user.watchlist.push({ filmId: req.body.filmId });
    await user.save();

    reply.status(200).send({ id: 'ADD', msg: `'${req.body.title}' was added to your watchlist.` });
  });

  fastify.delete('/:username/watchlist', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });
    const index = user.watchlist.map((w) => w.filmId).indexOf(req.body.filmId);
    if (index == -1) return reply.status(400).send('Failed to delete. Film is not in watchlist.');
    user.watchlist.splice(index, 1);

    await user.save();

    reply.status(200).send({ id: 'DELETE', msg: `'${req.body.title}' was removed from your watchlist.` });
  });

  fastify.post('/:username/ratings', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });
    let index = user.seen.map((s) => s.filmId).indexOf(req.body.filmId);

    index != -1
      ? (user.seen[index].rating = req.body.rating)
      : user.seen.push({ filmId: req.body.filmId, rating: req.body.rating });

    // Delete from watchlist after rating
    index = user.watchlist.map((w) => w.filmId).indexOf(req.body.filmId);
    if (index != -1) user.watchlist.splice(index, 1);

    await user.save();

    reply.status(204);
  });

  fastify.post('/:username/likes', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });
    const index = user.seen.map((s) => s.filmId).indexOf(req.body.filmId);

    index != -1 ? (user.seen[index].like = true) : user.seen.push({ filmId: req.body.filmId, like: true });

    await user.save();

    reply.status(204);
  });

  fastify.delete('/:username/likes', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });

    const likes = user.seen.filter((m) => m.like === true);
    if (likes.length <= 4)
      return reply.status(405).send({ id: 'LIKE_ERROR', msg: 'You must have at least 4 liked movies.' });

    const index = user.seen.map((l) => l.filmId).indexOf(req.body.filmId);
    if (index == -1) return reply.status(400).send('Failed to delete. Film is already not liked.');

    user.seen[index].like = false;

    await user.save();

    reply.status(204);
  });

  fastify.post('/:username/seen', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });

    const index = user.seen.map((s) => s.filmId).indexOf(req.body.filmId);
    if (index != -1) return reply.status(400).send('Film already in seen');

    user.seen.push({ filmId: req.body.filmId });

    await user.save();

    reply.status(200).send({ id: 'ADD', msg: `'${req.body.title}' was added to your seen.` });
  });

  fastify.delete('/:username/seen', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });
    const index = user.seen.map((s) => s.filmId).indexOf(req.body.filmId);

    const likes = user.seen.filter((m) => m.like === true);
    if (likes.length <= 4 && user.seen[index].like === true)
      return reply.status(405).send({ id: 'LIKE_ERROR', msg: 'You must have at least 4 liked movies.' });

    if (index == -1) return reply.status(400).send('Failed to delete. Film is not in seen.');
    user.seen.splice(index, 1);

    await user.save();

    reply.status(200).send({ id: 'DELETE', msg: `'${req.body.title}' was removed from your seen.` });
  });

  fastify.get('/:username/not-interested', async (req, reply) => {
    let user = await User.findOne({ username: req.params.username });
    if (!user) return reply.status(404).send('User does not exist.');

    const notInterested = await getMovieData(user.notInterested);

    reply.send(notInterested);
  });

  fastify.post('/:username/not-interested', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });

    const index = user.notInterested.map((n) => n.filmId).indexOf(req.body.filmId);
    if (index != -1) return reply.status(400).send('Film already in seen');

    user.notInterested.push({ filmId: req.body.filmId });

    await user.save();

    reply.status(200).send({ id: 'ADD', msg: `'${req.body.title}' was added to your not interested.` });
  });

  fastify.delete('/:username/not-interested', { preValidation: auth }, async (req, reply) => {
    const verifyUser = verifyUserRequest(req);
    if (!verifyUser) return reply.status(403).send('Forbidden. Not autorized as that user.');

    const user = await User.findOne({ username: req.params.username });
    const index = user.notInterested.map((n) => n.filmId).indexOf(req.body.filmId);
    if (index == -1) return reply.status(400).send('Failed to delete. Film is not in seen.');
    user.notInterested.splice(index, 1);

    await user.save();

    reply.status(200).send({ id: 'DELETE', msg: `'${req.body.title}' was removed from your not interested.` });
  });
};

module.exports = userRoutes;
