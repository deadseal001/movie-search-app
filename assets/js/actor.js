
// var searchInput="tom+cruise";//get this info from search box
// var getIDUrl="https://api.themoviedb.org/3/search/multi?api_key=074915bcf109483ca070f5358f0e524b&language=en-US&query="+searchInput;//two or more words linked with +//change api key with yours
// var search=function(){
//     fetch(getIDUrl).then(function (IDresponse) {
//         if (IDresponse.ok){
//             // console.log(IDresponse);
//             IDresponse.json().then(function(IDdata){
//                 console.log(IDdata);
//                 // list search results
//                 // case "media_type"=person show person name and profile
//                     //click link to send to page2
//                 // case "media_type"=movie show movie name and profile 
//                     //click lind and send to page3
//             })
//         } else {
//             alert('Error: Actor Not Found');
//         }
//     });
// }

// //click search button to call search function
// search();

var IdString=document.location.search;
// var actorID= queryString.split("=")[1]; //get ID from document.location
var actorID="500";

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
            alert('Error: Actor Not Found');//have to change to modal
        }
    });
    
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
            alert('Error: Actor Not Found');
        }
    });
}


var shownumber=6;
var nextval=0;
var listMovies=function(data2){
    var movieCardListEl=document.querySelector(".movieCardList");
    console.log("nextval = "+nextval);
    $(".movieCard").remove();
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
        var titleEl=document.createElement("h3");
            titleEl.classList="movieTitle link";
            titleEl.textContent=movieName;
            titleEl.setAttribute("data-id",movieID);
        movieCardEl.appendChild(titleEl); 
        //add releaseDate
        var releaseDate=data2.cast[i+nextval].release_date;
        var releaseDateEl=document.createElement("p");
            releaseDateEl.className="releasedata";
            releaseDateEl.textContent=(releaseDate);
        movieCardEl.appendChild(releaseDateEl);
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

}


actorData=getActorInfo();

actorMovie=getActorMovies();

$(".movieCardList").on("click",".link", function(){
    var movieID=$(this).attr("data-id");
    window.location.href="./movie.html?movieid="+movieID;//pass movie ID to the next page
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