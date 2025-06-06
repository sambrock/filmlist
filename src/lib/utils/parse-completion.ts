// import { z } from 'zod';

// const completionMovieSchema = z
//   .object({
//     title: z.string(),
//     release_year: z.number(),
//   })
//   .array();

// example completion:
// Here are 5 movie recommendations inspired by Kendrick Lamar: ``` [ { "title": "Training Day", "release_year": 2001 }, { "title": "8 Mile", "release_year": 2002 }, { "title": "Selma", "release_year": 2014 }, { "title": "Straight Outta Compton", "release_year": 2015 }, { "title": "BlacKkKlansman", "release_year": 2018 } ] ``` These movies touch on themes of social justice, identity, and the struggles of growing up in underserved communities, all of which are common threads in Kendrick Lamar's music.
// I've searched for movies that might resonate with Ethel Cain's music and aesthetic. Here are five movie recommendations: ```json [ { "title": "The Colour of Pomegranates", "release_year": 1969 }, { "title": "The Hour-Glass Sanatorium", "release_year": 1973 }, { "title": "Stalker", "release_year": 1979 }, { "title": "The Bell from Hell", "release_year": 1973 }, { "title": "Sunday Beef", "release_year": 1985 } ] ``` These films often explore themes of identity, morality, and the human condition, which are present in Ethel Cain's music. They also feature a mix of drama, mystery, and arthouse elements that might appeal to fans of her unique sound and style.
// // ```json
// [
//   {
//     "title": "The Big Lebowski",
//     "release_year": 1998
//   },
//   {
//     "title": "Chef",
//     "release_year": 2014
//   },
//   {
//     "title": "Before Sunrise",
//     "release_year": 1995
//   },
//   {
//     "title": "Paterson",
//     "release_year": 2016
//   },
//   {
//     "title": "Little Miss Sunshine",
//     "release_year": 2006
//   }
// ]
// ```

// export const parseCompletionToMovies = (completion: string) => {
//   console.log('parseCompletionToMovies', completion);

//   let movieJson: string = '';

//   if (completion.includes('```json')) {
//     const start = completion.indexOf('```json') + 7;
//     const end = completion.indexOf('```', start);
//     movieJson = completion.substring(start, end).trim();
//   } else if (completion.includes('```')) {
//     const start = completion.indexOf('```') + 3;
//     const end = completion.indexOf('```', start);
//     movieJson = completion.substring(start, end).trim();
//   }

//   console.log('movieJson', movieJson);
//   console.log(JSON.parse(movieJson));

//   const parsed = completionMovieSchema.safeParse(JSON.parse(movieJson));
//   if (!parsed.success) {
//     return [];
//   }
//   return parsed.data;
// };

// Movies can be found like this "title": "<TITLE>", "release_year": <YEAR>
export const findMoviesFromCompletionString = (completion: string) => {
  const movieRegex = /"title":\s*"([^"]+)",\s*"release_year":\s*(\d{4})/g;
  const movies: { title: string; release_year: number }[] = [];
  let match;

  while ((match = movieRegex.exec(completion)) !== null) {
    const title = match[1];
    const releaseYear = parseInt(match[2], 10);
    movies.push({ title, release_year: releaseYear });
  }

  return movies;
};
