const express = require('express');
const _ = require('lodash');

const User = require('../../../models/user');
const auth = require('../../../middleware/auth');
const TMDbService = require('../../../services/TMDbService');
const { verifyUserRequest, getMovieArrDetails } = require('../../../utils');

const router = express.Router();

// @route   GET api/username
// @desc    Get recommended movies for user
// @access  Public
router.post('/:username', async (req, res) => {
  let user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send('User does not exist.');

  const { limit } = req.query;
  const { basedOn } = req.body;

  const likes = user.seen.filter(s => s.like === true);
  if (likes.length < 3) return res.status(400).send({ id: 'MOVIES_ERROR', msg: 'Not enough liked movies.' })

  const randomLikes = _.sampleSize(_.difference(likes.map(m => m.filmId), basedOn), 2); //likes.length >= 6 ? 6 : 3

  const remove = [...user.seen, ...user.watchlist, ...user.notInterested].map(m => ({ id: m.filmId }));

  let movies = await TMDbService.getRecommendationsArr(randomLikes);
  movies = _.differenceBy(movies, remove, 'id');
  movies = _.uniqBy(movies, 'id');
  movies = movies.slice(0, limit);
  movies = getMovieArrDetails(movies);

  const hasMore = basedOn ? basedOn.length < likes.length : true;

  res.send({ basedOn: randomLikes, hasMore, results: movies });
});

// @route   GET api/username/watchlist
// @desc    Get user watchlist
// @access  Public
router.get('/:username/watchlist', async (req, res) => {
  let user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send('User does not exist.');

  const { page, limit } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const userWatchlist = user.watchlist.reverse().slice(startIndex, endIndex);
  const tmdbData = await TMDbService.getDataArr(userWatchlist.map(m => m.filmId));
  const watchlist = getMovieArrDetails(tmdbData);

  res.send(watchlist);
})

// @route   GET api/username/seen
// @desc    Get user seen
// @access  Public
router.get('/:username/seen', async (req, res) => {
  let user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send('User does not exist.');

  const { page, limit } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const userSeen = user.seen.reverse().slice(startIndex, endIndex);
  const tmdbData = await TMDbService.getDataArr(userSeen.map(m => m.filmId));
  const seen = getMovieArrDetails(tmdbData);

  res.send(seen.map((m, i) => ({ ...m, rating: userSeen[i].rating, like: userSeen[i].like })));
})

// @route   POST api/username/watchlist
// @desc    Add movie to user watchlist
// @access  Private 
router.post('/:username/watchlist', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });

  const index = user.watchlist.map(w => w.filmId).indexOf(req.body.filmId);
  if (index > -1) return res.status(400).send({ id: 'WATCHLIST_ERROR', msg: `'${req.body.title}' already in your watchlist.` });

  user.watchlist.push({ filmId: req.body.filmId });
  await user.save();

  res.status(200).send({ id: 'ADD', msg: `'${req.body.title}' was added to your watchlist.` });
})

// @route   DELETE api/username/watchlist
// @desc    Remove movie from user watchlist
// @access  Private 
router.delete('/:username/watchlist', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });
  const index = user.watchlist.map(w => w.filmId).indexOf(req.body.filmId);
  if (index == -1) return res.status(400).send('Failed to delete. Film is not in watchlist.');
  user.watchlist.splice(index, 1);

  await user.save();

  res.status(200).send({ id: 'DELETE', msg: `'${req.body.title}' was removed from your watchlist.` });
})

// @route   POST api/username/ratings
// @desc    Add movie rating to user ratings
// @access  Private 
router.post('/:username/ratings', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });
  let index = user.seen.map(s => s.filmId).indexOf(req.body.filmId);

  index != -1 ? user.seen[index].rating = req.body.rating : user.seen.push({ filmId: req.body.filmId, rating: req.body.rating });

  // Delete from watchlist after rating
  index = user.watchlist.map(w => w.filmId).indexOf(req.body.filmId);
  if (index != -1) user.watchlist.splice(index, 1);

  await user.save();

  res.sendStatus(200);
})

// @route   POST api/username/likes
// @desc    Add movie to user likes
// @access  Private 
router.post('/:username/likes', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });
  const index = user.seen.map(s => s.filmId).indexOf(req.body.filmId);

  index != -1 ? user.seen[index].like = true : user.seen.push({ filmId: req.body.filmId, like: true });

  await user.save();

  res.sendStatus(200);
})

// @route   DELETE api/username/likes
// @desc    Remove movie from user likes
// @access  Private 
router.delete('/:username/likes', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });

  const likes = user.seen.filter(m => m.like === true);
  if (likes.length <= 4) return res.status(405).send({ id: 'LIKE_ERROR', msg: 'You must have at least 4 liked movies.' });

  const index = user.seen.map(l => l.filmId).indexOf(req.body.filmId);
  if (index == -1) return res.status(400).send('Failed to delete. Film is already not liked.');

  user.seen[index].like = false;

  await user.save();

  res.sendStatus(200);
})


// @route   POST api/username/seen
// @desc    Add movie to user seen
// @access  Private 
router.post('/:username/seen', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });

  const index = user.seen.map(s => s.filmId).indexOf(req.body.filmId);
  if (index != -1) return res.status(400).send('Film already in seen');

  user.seen.push({ filmId: req.body.filmId });

  await user.save();

  res.status(200).send({ id: 'ADD', msg: `'${req.body.title}' was added to your seen.` });
})

// @route   DELETE api/username/seen
// @desc    Remove movie from user seen
// @access  Private 
router.delete('/:username/seen', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });
  const index = user.seen.map(s => s.filmId).indexOf(req.body.filmId);

  const likes = user.seen.filter(m => m.like === true);
  if (likes.length <= 4 && user.seen[index].like === true) return res.status(405).send({ id: 'LIKE_ERROR', msg: 'You must have at least 4 liked movies.' });

  if (index == -1) return res.status(400).send('Failed to delete. Film is not in seen.');
  user.seen.splice(index, 1);

  await user.save();

  res.status(200).send({ id: 'DELETE', msg: `'${req.body.title}' was removed from your seen.` });
})

// @route   GET api/username/not-interested
// @desc    Get user not interested
// @access  Public
router.get('/:username/not-interested', async (req, res) => {
  let user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send('User does not exist.');

  const notInterested = await getMovieData(user.notInterested);

  res.send(notInterested);
})

// @route   POST api/username/not-interested
// @desc    Add movie to user not interested
// @access  Private 
router.post('/:username/not-interested', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });

  const index = user.notInterested.map(n => n.filmId).indexOf(req.body.filmId);
  if (index != -1) return res.status(400).send('Film already in seen');

  user.notInterested.push({ filmId: req.body.filmId });

  await user.save();

  res.status(200).send({ id: 'ADD', msg: `'${req.body.title}' was added to your not interested.` });
})

// @route   DELETE api/username/seen
// @desc    Remove movie from user seen
// @access  Private 
router.delete('/:username/not-interested', auth, async (req, res) => {
  const verifyUser = verifyUserRequest(req);
  if (!verifyUser) return res.status(403).send('Forbidden. Not autorized as that user.');

  const user = await User.findOne({ username: req.params.username });
  const index = user.notInterested.map(n => n.filmId).indexOf(req.body.filmId);
  if (index == -1) return res.status(400).send('Failed to delete. Film is not in seen.');
  user.notInterested.splice(index, 1);

  await user.save();

  res.status(200).send({ id: 'DELETE', msg: `'${req.body.title}' was removed from your not interested.` });
})



module.exports = router;