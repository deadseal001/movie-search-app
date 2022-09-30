var searchList = ["tom cruise", "tom hanks"]; //["tom curise","tom hanks"]
var IdString = document.location.search;
console.log(IdString);

function saveSearchList() {
  console.log(searchList);
  localStorage.setItem("movieSearchList", JSON.stringify(searchList));
}

function loadSearchList() {
  //remove all the searchList button
  $(".history").remove();
  searchList = JSON.parse(localStorage.getItem("movieSearchList"));
  if (!searchList) {
    console.log("searchList!")
    searchList = [];
  }
  for (var i = 0; i < (Math.min(12, searchList.length)); i++) {
    var searchEl = $("<div>");
    searchEl.addClass(['history', 'flex', 'flex-col', 'items-center', 'justify-center', 'w-auto', 'h-10', 'text-xs', 'bg-gray-900', 'rounded-2xl', 'text-white', 'shadow', 'hover:shadow-md', 'cursor-pointer', 'mu-2', 'mr-2', 'p-1', 'transition', 'ease-in', 'duration-300']);
    var buttonEl = $("<button>");

    buttonEl.html(searchList[searchList.length - 1 - i]);
    //buttonEl.classList = "listBtn";
    buttonEl.addClass(['listBtn', 'items-center', 'justify-center', 'w-20', 'h-10']);

    searchEl.append(buttonEl);

    $(".searchList").prepend(searchEl);
  }
  if (searchList.length > 0) {
    document.getElementById("clearBtn").style.visibility = "visible";
  }
};

//function add new search to the searchList
function addSearchList(words) {
  console.log(words);

  for (i = 0; i < searchList.length; i++) {
    if (words === searchList[i]) {
      searchList.splice(i, 1);
    }
  }
  console.log(searchList);
  console.log(words);
  searchList.push(words);
  saveSearchList(searchList);
  loadSearchList();
}


function clearList() {
  $(".listBtn").remove();
  searchList = [];
  saveSearchList();
  loadSearchList();
  $(".history").hide('slow');
}

function callmodal(words) {

  //$('#error-modal').modal('show');
  //$(".modal-title").text(words);

  //cancel button
  $(".cancelBtn").on("click", function () {
    $(".modal-title").text("");
    //    $('#error-modal').modal('hide');
    $('searchBox').trigger("focus");
  })
}


function searchFunc(keyword, words) {

  Swal.fire({
    title: false,
    timer: 1000,
    width: 100,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
 
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  });
  console.log(keyword);
  console.log(words);
  $(".personCard").remove();
  var getIDUrl = "https://api.themoviedb.org/3/search/multi?api_key=074915bcf109483ca070f5358f0e524b&language=en-US&query=" + keyword;
  $('.searchLoop').html('');    
  console.info(getIDUrl);
  fetch(getIDUrl).then(function (response) {
    if (response.ok) {
      // console.log(IDresponse);
      response.json().then(function (data) {
        console.log(data);
        // list search results
        var nullcount = 0;
        for (var i = 0; i < data.results.length; i++) {
          switch (data.results[i].media_type) {
            case "person":
              addperson(data, i);
              break;
            case "movie":
              addmovie(data, i);
              break;
            default:
              nullcount++;
          }
        }
		
		$('#searchResultsTitle').html('Search Reults for <b>'+keyword+"</b>");
		  
        if (nullcount === data.results.length) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: '<b>'+ words + '</b> Not Found.',
          })
        } else {
          addSearchList(words); // add button save and load
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: '<b>'+ words + '</b> Not Found.',
      })
    }
  });

}
function gatPopular() {

  Swal.fire({
    title: false,
    timer: 500,
    width: 100,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
      
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  });
  $(".personCard").remove();
  var getIDUrl = "https://api.themoviedb.org/3/movie/popular?api_key=074915bcf109483ca070f5358f0e524b&language=en-US";
  $('.searchLoop').html('');    
  console.info(getIDUrl);
  fetch(getIDUrl).then(function (response) {
    if (response.ok) {
      // console.log(IDresponse);
      response.json().then(function (data) {
        console.log(data.results.length);
        // list search results
        var nullcount = 0;
        for (var i = 0; i < data.results.length; i++) {
         addmovie(data, i);
        }
        if (nullcount === data.results.length) {

        } else {
          //addSearchList(words); // add button save and load
        }
      })
    } else {

    }
  });

}
function addperson(data, i) {
  if (i == 0) {
    var pcontainerEl = document.querySelector(".personcard");
    var personCardEl = document.createElement("div");
    personCardEl.classList = "personCard bg-black-300/0.5";
    var postercontainerEl = document.createElement("div");
    postercontainerEl.classList = "posterdiv bg";
    var posterEl = document.createElement("img");
    posterEl.classList = "poster link rounded-lg"
    posterEl.setAttribute("src", "https://image.tmdb.org/t/p/w500" + data.results[i].profile_path);
    posterEl.setAttribute("alt", data.results[i].name);
    posterEl.setAttribute("data-id", data.results[i].id);
    posterEl.setAttribute("data-type", data.results[i].media_type);
    postercontainerEl.appendChild(posterEl);
    personCardEl.appendChild(postercontainerEl);
    var infocontainerEl = document.createElement("ul");
    infocontainerEl.classList = "infodiv bg"
    var media_typeEl = document.createElement("li");
    media_typeEl.textContent = "Media Type: " + data.results[i].media_type;
    var knownForEl = document.createElement("li");
    knownForEl.textContent = "Known For: " + data.results[i].known_for_department;
    var nameEl = document.createElement("li");
    nameEl.classList = "name link";
    nameEl.textContent = "Name: " + data.results[i].name;
    nameEl.setAttribute("data-id", data.results[i].id);
    nameEl.setAttribute("data-type", data.results[i].media_type);
    infocontainerEl.appendChild(media_typeEl);
    infocontainerEl.appendChild(knownForEl);
    infocontainerEl.appendChild(nameEl);
    personCardEl.appendChild(infocontainerEl);
    pcontainerEl.append(personCardEl);
  } else {
    var $containerEl = $(".searchLoop");
    var movieEl = $('<div>');
    movieEl.addClass(['flex-none', 'link', 'name', 'py-2', 'px-1', 'first:pl-6', 'last:pr-6']);
    movieEl.attr("data-id", data.results[i].id);
    movieEl.attr("data-type", data.results[i].media_type);
    var docEl = ``;
    docEl += `<div class="relative bg-white shadow-md rounded-3lg bg-cover text-gray-800  overflow-hidden cursor-pointer object-cover object-center rounded-lg shadow-md w-64 h-96 my-2" style="background-image:url('https://image.tmdb.org/t/p/w500` + data.results[i].poster_path + `')">`;
    docEl += `<div class="absolute bg-gradient-to-t from-green-100 to-green-400  opacity-50 inset-0 z-0"></div>`;
    docEl += `<div class="relative flex flex-row items-end  h-96 w-full ">`;
    docEl += `<div class="absolute right-0 top-0 m-2">`;
    docEl += `<svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 p-2 text-gray-200 hover:text-blue-400 rounded-full hover:bg-white transition ease-in duration-200 " fill="none" viewBox="0 0 24 24" stroke="currentColor">`;
    docEl += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>`;
    docEl += `</svg>`;
    docEl += `</div>`;
    docEl += `<div class="p-6 rounded-lg  flex flex-col w-full z-10 ">`;
    docEl += `<h4 class="mt-1 text-white text-xl font-semibold  leading-tight truncate">` + data.results[i].title + `</h4>`;
    docEl += `<div class="flex justify-between items-center ">`;
    docEl += `<div class="flex flex-col">`;
    docEl += `<h2 class="text-sm flex items-center text-white font-normal">`;
    docEl += `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">`;
    docEl += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"> </path>`;
    docEl += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>`;
    docEl += `</svg>`;
    docEl += data.results[i].release_date + ` </h2>`;
    docEl += `</div>`;
    docEl += `</div>`;
    docEl += `<div class="flex pt-4  text-sm text-gray-300">`;
    docEl += `<div class="flex items-center mr-auto">`;
    docEl += `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">`;
    docEl += `<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"> </path>`;
    docEl += `</svg>`;
    docEl += `<p class="font-normal">` + data.results[i].vote_average + `/10</p>`;
    docEl += `</div>`;
    docEl += `<div class="flex items-center font-medium text-white "> Popularity <span class="text-gray-300 text-sm font-normal">` + data.results[i].popularity + `</span> </div>`;
    docEl += `</div>`;
    docEl += `</div>`;
    docEl += `</div>`;
    docEl += `</div>`;
    docEl += `</div>`;
    movieEl.html(docEl);
    //  var personCardEl = document.createElement("div");
    //  personCardEl.classList = "personCard bg-black-500/0.5";
    //  var postercontainerEl = document.createElement("div");
    //  postercontainerEl.classList = "posterdiv bg";
    //  var posterEl = document.createElement("img");
    //  posterEl.classList = "poster link"
    //  posterEl.setAttribute("src", "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path);
    //  posterEl.setAttribute("alt", data.results[i].title);
    //  posterEl.setAttribute("data-id", data.results[i].id);
    //  posterEl.setAttribute("data-type", data.results[i].media_type);
    //  postercontainerEl.appendChild(posterEl);
    //  personCardEl.appendChild(postercontainerEl);
    //  var infocontainerEl = document.createElement("ul");
    //  infocontainerEl.classList = "infodiv bg"
    //  var media_typeEl = document.createElement("li");
    //  media_typeEl.textContent = "Media Type: " + data.results[i].media_type;
    //  var dateEl = document.createElement("li");
    //  dateEl.textContent = "Release Date: " + data.results[i].release_date;
    //  var nameEl = document.createElement("li");
    //  docEl.classList = "name link";
    //  docEl.setAttribute("data-id", data.results[i].id);
    //  docEl.setAttribute("data-type", data.results[i].media_type);
    //  infocontainerEl.appendChild(media_typeEl);
    //  infocontainerEl.appendChild(nameEl);
    //  infocontainerEl.appendChild(dateEl);
    //  personCardEl.appendChild(infocontainerEl);
    $containerEl.append(movieEl);
  }
}

function addmovie(data, i) {
  var $containerEl = $(".searchLoop");
  var movieEl = $('<div>');
  movieEl.addClass(['flex-none', 'link', 'py-2', 'px-1', 'first:pl-6', 'last:pr-6']);
  movieEl.attr("data-id", data.results[i].id);
  movieEl.attr("data-type", 'movie');
  var docEl = ``;
  docEl += `<div class="relative bg-white shadow-md rounded-3lg bg-cover text-gray-800  overflow-hidden cursor-pointer object-cover object-center rounded-lg shadow-md w-64 h-96 my-2" style="background-image:url('https://image.tmdb.org/t/p/w500` + data.results[i].poster_path + `')">`;
  docEl += `<div class="absolute bg-gradient-to-t from-green-100 to-green-400  opacity-50 inset-0 z-0"></div>`;
  docEl += `<div class="relative flex flex-row items-end  h-96 w-full ">`;
  docEl += `<div class="absolute right-0 top-0 m-2">`;
  docEl += `<svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 p-2 text-gray-200 hover:text-blue-400 rounded-full hover:bg-white transition ease-in duration-200 " fill="none" viewBox="0 0 24 24" stroke="currentColor">`;
  docEl += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>`;
  docEl += `</svg>`;
  docEl += `</div>`;
  docEl += `<div class="p-6 rounded-lg  flex flex-col w-full z-10 ">`;
  docEl += `<h4 class="mt-1 text-white text-xl font-semibold  leading-tight truncate">` + data.results[i].title + `</h4>`;
  docEl += `<div class="flex justify-between items-center ">`;
  docEl += `<div class="flex flex-col">`;
  docEl += `<h2 class="text-sm flex items-center text-white font-normal">`;
  docEl += `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">`;
  docEl += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"> </path>`;
  docEl += `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>`;
  docEl += `</svg>`;
  docEl += data.results[i].release_date + ` </h2>`;
  docEl += `</div>`;
  docEl += `</div>`;
  docEl += `<div class="flex pt-4  text-sm text-gray-300">`;
  docEl += `<div class="flex items-center mr-auto bg-green-700 rounded-lg p-2">`;
  docEl += `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">`;
  docEl += `<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"> </path>`;
  docEl += `</svg>`;
  docEl += `<p class="font-normal">` + data.results[i].vote_average + `/10</p>`;
  docEl += `</div>`;
  docEl += `<div class="flex items-center font-medium text-white "><span class="text-gray-300 text-sm font-normal"></span> </div>`;
  docEl += `</div>`;
  docEl += `</div>`;
  docEl += `</div>`;
  docEl += `</div>`;
  docEl += `</div>`;
  movieEl.html(docEl);
  //  var personCardEl = document.createElement("div");
  //  personCardEl.classList = "personCard bg-black-500/0.5";
  //  var postercontainerEl = document.createElement("div");
  //  postercontainerEl.classList = "posterdiv bg";
  //  var posterEl = document.createElement("img");
  //  posterEl.classList = "poster link"
  //  posterEl.setAttribute("src", "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path);
  //  posterEl.setAttribute("alt", data.results[i].title);
  //  posterEl.setAttribute("data-id", data.results[i].id);
  //  posterEl.setAttribute("data-type", data.results[i].media_type);
  //  postercontainerEl.appendChild(posterEl);
  //  personCardEl.appendChild(postercontainerEl);
  //  var infocontainerEl = document.createElement("ul");
  //  infocontainerEl.classList = "infodiv bg"
  //  var media_typeEl = document.createElement("li");
  //  media_typeEl.textContent = "Media Type: " + data.results[i].media_type;
  //  var dateEl = document.createElement("li");
  //  dateEl.textContent = "Release Date: " + data.results[i].release_date;
  //  var nameEl = document.createElement("li");
  //  docEl.classList = "name link";
  //  docEl.setAttribute("data-id", data.results[i].id);
  //  docEl.setAttribute("data-type", data.results[i].media_type);
  //  infocontainerEl.appendChild(media_typeEl);
  //  infocontainerEl.appendChild(nameEl);
  //  infocontainerEl.appendChild(dateEl);
  //  personCardEl.appendChild(infocontainerEl);
  $containerEl.append(movieEl);
}


//bottom of the js
//check if document.location.search has information to process
if (IdString != "") {
  var searchKeyWord = IdString.split("=")[1];
  var searchWordArr = searchKeyWord.split("+");
  var words = searchWordArr[0];
  for (i = 1; i < searchWordArr.length; i++) {
    words = words + " " + searchWordArr[i];
  }
  //  $('#error-modal').modal('hide');
  console.log(words);
  loadSearchList();
  searchFunc(searchKeyWord, words);

} else {
  // saveSearchList();
  loadSearchList();
  //  $('#error-modal').modal('hide');
}


$(".searchList").on("click", ".listBtn", function () {
  var searchwords = $(this).text();
  console.log(searchwords);
  var searchWordArr = searchwords.split(" ");
  console.log(searchWordArr);
  var searchKeyWord = searchWordArr[0];
  for (var i = 1; i < searchWordArr.length; i++) {
    searchKeyWord = searchKeyWord + "+" + searchWordArr[i];
  }
  console.log(searchKeyWord);
  searchFunc(searchKeyWord, searchwords);
})

$("#clearBtn").on("click", clearList);

var searchFormEl = document.querySelector(".search-form");
var searchBoxEl = document.querySelector(".searchBox");

function formSubmitHandler(event) {
  event.preventDefault();
  var words = searchBoxEl.value.trim();

  console.log(words);
  if (words == "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please input Actor or Movie of interest in the search box!',
    })
  } else {
    var wordArr = words.split(" ");
    var len = wordArr.length;
    var queryStr = "";
    queryStr = wordArr[0];
    for (var i = 1; i < len; i++) {
      queryStr = queryStr + "+" + wordArr[i];
    }
    console.log(queryStr);
    $(".searchBox").val("");
    searchFunc(queryStr, words);
  }
}

$(searchFormEl).on("submit", formSubmitHandler);

$("body").on("click", ".link", function () {
  var type = $(this).attr("data-type");
  var id = $(this).attr("data-id");
  switch (type) {
    case "person":
      window.location.href = "./actors.html?actorid=" + id;
      break;
    case "movie":
      window.location.href = "./trailers.html?movieid=" + id;

  }
})

$('document').ready(function(){
	gatPopular();
	
});
