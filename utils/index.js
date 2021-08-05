const { Duration } = require('luxon');
const Joi = require('@hapi/joi');

function getMovieArrDetails(moviesArr) {
  return moviesArr
    .map((movie) => {
      const { id, title, vote_average, release_date, backdrop_path, poster_path, popularity, rating, like } = movie;
      return {
        id,
        title,
        vote_average: vote_average.toFixed(1),
        backdrop_path,
        poster_path,
        popularity,
        year: new Date(release_date).getFullYear(),
        rating,
        like,
      };
    })
    .filter((m) => m.popularity > 2)
    .filter((m) => m.poster_path !== null);
}

function getMovieSearchArrDetails(moviesArr) {
  return moviesArr
    .map((movie) => {
      const { id, title, vote_average, release_date, backdrop_path, poster_path, popularity } = movie;
      return {
        id,
        title,
        vote_average: vote_average.toFixed(1),
        backdrop_path,
        poster_path,
        popularity,
        year: new Date(release_date).getFullYear(),
      };
    })
    .filter((m) => m.popularity > 2 && m.poster_path !== null);
}

function getMovieDetails(movie) {
  const {
    id,
    title,
    vote_average,
    release_date,
    backdrop_path,
    credits,
    overview,
    genres,
    runtime,
    releases,
    vote_count,
  } = movie;

  // Get relevant movie details
  movie = {
    id,
    title,
    backdrop_path,
    overview,
    vote_average: vote_average ? vote_average.toFixed(1) : false,
    vote_count,
    release_date,
    year: new Date(movie.release_date).getFullYear(),
    runtime: Duration.fromObject({ minutes: runtime }).shiftTo('hours', 'minutes').toObject(),
    genres,
    credits,
  };

  // Get certification
  const certification = releases.countries.filter((r) => r.iso_3166_1 === 'GB');
  movie.certification = certification.length !== 0 ? certification[0].certification : 'Not Rated';

  // Limit cast to 10
  movie.credits.cast = movie.credits.cast
    .filter((member) => member.order <= 10)
    .map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      profile_path: member.profile_path,
    }));

  // Get Writer & Director
  movie.credits.crew = movie.credits.crew
    .filter((member) => member.job === 'Director' || member.job === 'Screenplay' || member.job === 'Writer')
    .map((member) => {
      const obj = { id: member.id, name: member.name };
      if (member.job === 'Screenplay') return { ...obj, job: 'Writer' };
      return { ...obj, job: member.job };
    })
    .sort((a, b) => (a.job > b.job ? 1 : -1));

  // Group crew
  movie.credits.crew = Object.values(
    movie.credits.crew.reduce((member, i) => {
      if (member[i.id]) {
        member[i.id].job = [member[i.id].job, i.job].join(', ');
      } else {
        member[i.id] = i;
      }
      return member;
    }, {})
  );

  // Order by diurector first ...

  return movie;
}

function verifyUserRequest(req) {
  if (req.params.username != req.user.username) return false;
  return true;
}

function validateUser(user) {
  const schema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    username: Joi.string().alphanum().min(3).max(32).required(),
    password: Joi.string().min(8).max(32).required(),
  });

  return schema.validate(user);
}

module.exports = { getMovieArrDetails, getMovieSearchArrDetails, getMovieDetails, verifyUserRequest, validateUser };
