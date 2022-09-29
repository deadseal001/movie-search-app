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
var movieIDcapture = window.location.search.split(`=`)[1];

//search list 
function loadSearchList(){
  //remove all the searchList button
  $(".listBtn").remove();
  var searchList=JSON.parse(localStorage.getItem("movieSearchList"));
  if(!searchList) {
      console.log("searchList!")
      searchList=[];
  }
  for (var i=0; i< (Math.min(12, searchList.length)); i++) {
      var searchEl=document.createElement("button");
      searchEl.textContent=searchList[searchList.length-1-i];
      searchEl.classList="listBtn bg-gray-500";
      $(".searchList").append(searchEl);
  }
  if(searchList.length > 0) {
      //document.getElementById("clearBtn").style.visibility="visible";
  }
};
//clear search list button function
function clearList(){
  $(".listBtn").remove();
  localStorage.setItem("movieSearchList",JSON.stringify([]));
  //document.getElementById("clearBtn").style.visibility="hidden";
}


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
  // const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieSearch}`;
  const apiUrl = 'https://api.themoviedb.org/3/movie/'+movieIDcapture+'?api_key=a725cdae9e4df8f603b55513ee6ac4e8&language=en-US'
  const movieData = await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data);
  // MOVIE ID, TITLE, DATE RELEASED, POSTER
  console.log(movieData);
  //movieID = movieData.results[0].id;
  movieTitle = movieData.title;
  movieDate = movieData.release_date;
  moviePoster = movieData.poster_path;
 
 
  console.log(movieData);

  // FETCH MOVIE PROVIDERS
  const providerUrl = `https://api.themoviedb.org/3/movie/${movieIDcapture}/watch/providers?api_key=${apiKey}`;
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
  const trailerUrl = `https://api.themoviedb.org/3/movie/${movieIDcapture}/videos?api_key=${apiKey}&language=en-US`;
  const movieTrailer = await fetch(trailerUrl)
    .then((response) => response.json())
    .then((data) => data);
  movieTrailerKey = movieTrailer.results[0].key;

  displayMovieData();
};

//show modal instead of alert
function callmodal(words){

  $('#error-modal').modal('show');
      $(".modal-title").text(words);

  //cancel button
  $(".cancelBtn").on("click",function(){
      $(".modal-title").text("");
      $('#error-modal').modal('hide');
      $('searchBox').trigger("focus");
  })
}

// Wenbo: We will guide all the search to page 1, so I commented out the follwing code
const formSubmitHandler = function (event) {
  event.preventDefault();
  // $(movieProviderList).remove();
  const searchBox = $(`.searchBox`);
  const movieSearch = $(searchBox).val().trim();
  // console.log(movieSearch);

  var wordArr=movieSearch.split(" ");
  var len=wordArr.length;
  var queryStr="";
  queryStr=wordArr[0];
  for (var i=1; i<len; i++){
      queryStr=queryStr+"+"+wordArr[i];
  }
  console.log(queryStr);
  $(".searchBox").val("");


  if (movieSearch != "") {
    searchBox.val(``);
    //getMovieData(movieSearch);
    document.location.href="./index.html?keyword="+queryStr;
  } else {
    callmodal("Please input Actor or Movie of interest in the search box!")//add call mudal function.

  }
};

 $(searchInput).submit(formSubmitHandler);



$(".searchList").on("click", ".listBtn", function(){
  var searchwords=$(this).text();
  var searchWordArr=searchwords.split(" ");
  var searchKeyWord=searchWordArr[0];
  for (var i=1; i<searchWordArr.length; i++){
      searchKeyWord=searchKeyWord+"+"+searchWordArr[i];
  }
  console.log(searchKeyWord);
  document.location.href="./index.html?keyword="+searchKeyWord;
})

//$("#clearBtn").on("click", clearList);

loadSearchList();
if (movieIDcapture)
getMovieData();