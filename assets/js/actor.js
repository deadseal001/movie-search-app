var IdString=document.location.search;
var actorID= IdString.split("=")[1]; //get ID from document.location

function loadSearchList(){
    //remove all the searchList button
    $(".listBtn").remove();
    searchList=JSON.parse(localStorage.getItem("movieSearchList"));
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

function clearList(){
    $(".listBtn").remove();
    localStorage.setItem("movieSearchList",JSON.stringify([]));
    //document.getElementById("clearBtn").style.visibility="hidden";
}

var getActorInfo=function (){
    var actorinfoUrl="https://api.themoviedb.org/3/person/"+actorID+"?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
    

    fetch(actorinfoUrl).then(function (response) {
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
                $("#actorname").text(data.name);
                $("#dob").text("Birthday: "+ data.birthday);
                $("#birthPlace").text("Place of Birth: "+ data.place_of_birth);
                $("#known").text("Known for: "+ data.known_for_department);
                $("#bio").text("Biography: "+ data.biography);
                $("#link").text(data.homepage).attr("href",data.homepage);
                $(".actor-img").attr("src","https://image.tmdb.org/t/p/w500"+data.profile_path).attr("alt",data.name);
                if (data.deathday=null){
                    $("#deathday").remove();
                } else {
                    $("#deathday").text(data.deathday);
                }
                
                switch(data.gender) {
                    case 1:
                        $("#gender").text("Gender: Female");
                        break;
                    case 2:
                        $("#gender").text("Gender: Male");
                        break;
                    default:
                        $("#gender").text("Gender: Unknown/Other");
                        break;
                }
            })
            
        } else {
            callmodal("Error! Actor Not Found!");
        }
    });
    
}

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

var movies=[];

var getActorMovies=function(){
    var actorMovieUrl="https://api.themoviedb.org/3/person/"+actorID+"/movie_credits?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
    fetch(actorMovieUrl).then(function (response2) {
        if (response2.ok){
            response2.json().then(function(data2){
                console.log(data2);
                movies=data2
                listMovies(data2);
                console.log(movies)
            })
            
        } else {
            callmodal("Actor");
        }
    });
}


var shownumber=6;
var nextval=0;
var listMovies=function(data2){
    var movieCardListEl=document.querySelector(".movieCardList");
    console.log("nextval = "+nextval);
    $(".movieCard").remove();
    var firstcard=nextval*6+1;
    var lastcard=Math.min(data2.cast.length,firstcard+5);
    var left = data2.cast.length-(nextval+1)*shownumber;
    console.log(left);
    for (var i=0; i<Math.min(shownumber,left); i++){
        var movieID=data2.cast[i+nextval*shownumber].id;
        var movieCardEl=document.createElement("card");
            movieCardEl.className="movieCard";
            movieCardEl.setAttribute("width", "150px");
        var posterLink="https://image.tmdb.org/t/p/w500"+data2.cast[i+nextval*shownumber].poster_path;
        var postEl=document.createElement("img");
            postEl.classList="moviePoster  link";
            postEl.setAttribute("src",posterLink);
            postEl.setAttribute("width", "150px");
            postEl.setAttribute("alt",data2.cast[i+nextval*shownumber].title);
            postEl.setAttribute("data-id",movieID);
        //add poster element
        movieCardEl.appendChild(postEl);
        //add title
        var movieName=data2.cast[i+nextval*shownumber].title;        
        var titleCEl=document.createElement("div");
		titleCEl.classList="";
        var titleEl=document.createElement("h3");
            titleEl.classList="movieTitle link pl-3";
            titleEl.textContent=movieName;
            titleEl.setAttribute("data-id",movieID);
        titleCEl.appendChild(titleEl); 
        
        //add releaseDate
        var releaseDate=data2.cast[i+nextval].release_date;
        var releaseDateEl=document.createElement("p");
            releaseDateEl.className="releasedata pl-3";
            releaseDateEl.textContent=(releaseDate);
		titleCEl.appendChild(releaseDateEl); 
        movieCardEl.appendChild(titleCEl); 
        // appendchild to the parent container
        movieCardListEl.appendChild(movieCardEl);
    }
    //previous button and next button
    if (nextval >0) {
        document.getElementById("previous").style.visibility="visible";
    } else {
        document.getElementById("previous").style.visibility="hidden";
    }

    if (left-shownumber<1) {
        document.getElementById("next").style.visibility="hidden";
    } else {
        document.getElementById("next").style.visibility="visible";
    }
    $("#cardnumber").text(firstcard+" - "+lastcard+" / "+data2.cast.length);
}

loadSearchList();

getActorInfo();
getActorMovies();

$(".movieCardList").on("click",".link", function(){
    var movieID=$(this).attr("data-id");
    window.location.href="./trailers.html?movieid="+movieID;//pass movie ID to the next page
});
//eventlistener to next button

$("#previous").on("click",function(){
    nextval=nextval-1;
    listMovies(movies);
})
$("#next").on("click",function(){
    nextval=nextval+1;
    listMovies(movies);
})

var searchFormEl=document.querySelector(".search-form");
var searchBoxEl=document.querySelector(".searchBox");
function formSubmitHandler(event){
    event.preventDefault();
    var words= searchBoxEl.value.trim();
    
    console.log(words);
    if (words ==""){
        callmodal("Please input Actor or Movie of interest in the search box!");
    } else {
        var wordArr=words.split(" ");
        var len=wordArr.length;
        var queryStr="";
        queryStr=wordArr[0];
        for (var i=1; i<len; i++){
            queryStr=queryStr+"+"+wordArr[i];
        }
        console.log(queryStr);
        $(".searchBox").val("");
        document.location.href="./index.html?keyword="+queryStr;
    }
}

$(searchFormEl).on("submit", formSubmitHandler);

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

//edit search function for blank
