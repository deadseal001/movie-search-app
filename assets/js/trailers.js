const searchInput = $(`.search-box`);
const apiKey = `a725cdae9e4df8f603b55513ee6ac4e8`;
let movieID = [];
let movieTitle = [];
let movieDate = [];
let moviePoster = [];
let movieTrailerKey = [];
let movieProvider = [];
let movieProviderName = [];
let movieProviderImg = [];
let movieProviderLink = [];

const movieProviderEl = $(`#movie-provider`);
const providerWrapper = $(`.provider-wrapper`);

// ! ADDED movieIDcapture TO GET MOVIE ID FROM MOVIE SEARCH, THEN PASS IT TO getMovieData() at line 77
// ! DON'T FORGET TO CHANGE movieID to movieIDcapture in the fetches at lines 72, 85, 100
const movieIDcapture = window.location.search.split(`=`)[1];

// ! DISPLAY MOVIE DATA
const displayMovieData = function () {
  // movieProviderEl.remove(`.provider`);
  // MOVIE TITLE
  const movieTitleEl = $(`.movie-title`);
  $(movieTitleEl).text(`${movieTitle}, Released: ${movieDate}`);

  // MOVIE POSTER
  const moviePosterEl = $(`#movie-poster`);
  $(moviePosterEl).attr(`src`, `https://image.tmdb.org/t/p/w500${moviePoster}`);
  $(moviePosterEl).attr(`alt`, `${movieTitle} Movie Poster`);

  // MOVIE TRAILER
  const movieTrailerEl = $(`#movie-trailer`);
  const iFrameRemove = $(`iframe`);
  $(iFrameRemove).remove();
  const movieTrailerFrame = document.createElement(`iframe`);
  $(movieTrailerFrame).attr({
    src: `https://www.youtube.com/embed/${movieTrailerKey}`,
    frameborder: `0`,
    width: `560`,
    height: `360`,
    allow: `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`,
    allowfullscreen: ``,
  });
  $(movieTrailerEl).append(movieTrailerFrame);

  // ! MOVIE PROVIDERS
  const movieProviderDiv = document.createElement(`div`);
  for (let i = 0; i < movieProviderName.length; i += 1) {
    $(movieProviderDiv).addClass(`list`);
    const movieProviderImgEl = document.createElement(`img`);
    const movieProviderNameEl = document.createElement(`span`);
    $(movieProviderImgEl).attr({
      src: `https://image.tmdb.org/t/p/w500${movieProviderImg[i]}`,
      alt: `${movieProviderName[i]} logo`,
      style: `width: 50px; height: 50px;`,
    });
    $(movieProviderNameEl).text(movieProviderName[i]);
    $(movieProviderDiv).append(movieProviderImgEl, movieProviderNameEl);
    $(movieProviderEl).html(movieProviderDiv);
    $(providerWrapper).html(movieProviderEl);
  }
};

// ! RETRIEVE MOVIE DATA
const getMovieData = async (movieSearch) => {
  // FETCH MOVIE DATA
  movieProviderName = [];
  movieProviderImg = [];
  movieProviderLink = [];
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieSearch}`;
  const movieData = await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data);
  // MOVIE ID, TITLE, DATE RELEASED, POSTER
  // movieID = movieIDcapture;
  movieID = movieData.results[0].id;
  movieTitle = movieData.results[0].title;
  movieDate = movieData.results[0].release_date;
  moviePoster = movieData.results[0].poster_path;
  console.log(movieData);

  // FETCH MOVIE PROVIDERS
  const providerUrl = `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${apiKey}`;
  const movieProviderData = await fetch(providerUrl)
    .then((response) => response.json())
    .then((data) => data);
  // console.log(movieProviderData);

  // MOVIE PROVIDERS
  movieProvider = movieProviderData.results.US.buy;
  for (let i = 0; i < movieProvider.length; i += 1) {
    movieProviderName.push(movieProvider[i].provider_name);
    movieProviderImg.push(movieProvider[i].logo_path);
    movieProviderLink.push(movieProvider[i].provider_id);
  }

  // FETCH MOVIE TRAILER
  const trailerUrl = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${apiKey}&language=en-US`;
  const movieTrailer = await fetch(trailerUrl)
    .then((response) => response.json())
    .then((data) => data);
  movieTrailerKey = movieTrailer.results[0].key;

  displayMovieData();
};

const formSubmitHandler = function (event) {
  event.preventDefault();
  // $(movieProviderList).remove();
  const searchBox = $(`.searchBox`);
  const movieSearch = $(searchBox).val().trim();
  // console.log(movieSearch);

  if (movieSearch) {
    searchBox.val(``);
    getMovieData(movieSearch);
  }
};

$(searchInput).submit(formSubmitHandler);
