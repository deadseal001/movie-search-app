const searchInput = $(`.search-box`);
const apiKey = `a725cdae9e4df8f603b55513ee6ac4e8`;
let movieID = [];
let movieTitle = [];
let movieDate = [];
let moviePoster = [];
let movieTrailerKey = [];

const displayMovieData = function () {
  // MOVIE TITLE
  const movieTitleEl = $(`.movie-title`);
  $(movieTitleEl).text(`${movieTitle}, Released: ${movieDate}`);

  // MOVIE POSTER
  const moviePosterEl = $(`#movie-poster`);
  $(moviePosterEl).attr(`src`, `https://image.tmdb.org/t/p/w500${moviePoster}`);

  // MOVIE TRAILER
  const movieTrailerEl = $(`#movie-trailer`);
  const movieTrailerFrame = document.createElement(`iframe`);
  $(movieTrailerFrame).attr({
    src: `https://www.youtube.com/embed/${movieTrailerKey}`,
    frameborder: `0`,
    width: `560`,
    height: `360`,
  });

  $(movieTrailerEl).append(movieTrailerFrame);
};

const getMovieData = async (movieSearch) => {
  // FETCH MOVIE DATA
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieSearch}`;
  const movieData = await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data);
  // MOVIE ID, TITLE, DATE RELEASED, POSTER
  movieID = movieData.results[0].id;
  movieTitle = movieData.results[0].title;
  movieDate = movieData.results[0].release_date;
  moviePoster = movieData.results[0].poster_path;

  // FETCH MOVIE TRAILER
  const trailerUrl = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${apiKey}&language=en-US`;
  const movieTrailer = await fetch(trailerUrl)
    .then((response) => response.json())
    .then((data) => data);
  movieTrailerKey = movieTrailer.results[0].key;

  console.log(movieID, movieTitle, moviePoster, movieTrailerKey);

  displayMovieData();
};

const formSubmitHandler = function (event) {
  event.preventDefault();
  const searchBox = $(`.searchBox`);
  const movieSearch = $(searchBox).val().trim();
  // console.log(movieSearch);

  if (movieSearch) {
    searchBox.val(``);
    getMovieData(movieSearch);
    // getMovieRatings(movieSearch);
    // getMovieTrailer(movieSearch);
  }
};

$(searchInput).submit(formSubmitHandler);
