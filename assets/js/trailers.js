const searchInput = $(`.search-box`);
const apiKey = `a725cdae9e4df8f603b55513ee6ac4e8`;
let movieID = [];
let movieImgPath = ``;
const movieTrailerPath = ``;

const getMovieData = function (movieSearch) {
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieSearch}`;
  // FETCH MOVIE DATA
  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
          // RETRIEVE MOVIE ID & MOVIE IMAGE PATH
          movieID = data.results[0].id;
          // console.log(movieID);
          movieImgPath = data.results[0].poster_path;
          // console.log(movieImgPath);

          // SET MOVIE TITLE TO PAGE
          const movieName = $(`.movie-name`);
          const movieNameTitle = data.results[0].original_title;
          $(movieName).text(movieNameTitle);
          // getMovieTrailer(movieID);

          // SET MOVIE IMAGE TO PAGE
          const movieImg = $(`#movie-img`);
          const movieImgUrl = `https://image.tmdb.org/t/p/w500${movieImgPath}`;
          $(movieImg).attr(`src`, movieImgUrl);
        });
      } else {
        alert(`Error: Movie Not Found`);
      }
    })
    .catch((error) => {
      alert(`Unable to connect to Movie Database`);
    });
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
