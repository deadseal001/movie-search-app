
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



var actorID="500";
var actorApiUrl="https://api.themoviedb.org/3/person/"+actorID+"?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
var actorMovieUrl="https://api.themoviedb.org/3/person/"+actorID+"/movie_credits?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
var getActorInfo=function (){
    fetch(actorApiUrl).then(function (response) {
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
                $("#actorname").text(data.name);
                $("#dob").text("Birthday: "+ data.birthday);
                $("#birthPlace").text("Place of Birth: "+ data.place_of_birth);
                $("#known").text("Known for: "+ data.known_for_department);
                $("#bio").text("Biography: "+ data.biography);
                $("#link").text(data.homepage).attr("href",data.homepage);
                $(".actor-img").attr("src","https://image.tmdb.org/t/p/w500"+data.profile_path);
            })
            
        } else {
            alert('Error: Actor Not Found');//have to change to modal
        }
    });
    
}




var getActorMovies=function(){
    fetch(actorMovieUrl).then(function (response2) {
        if (response2.ok){
            response2.json().then(function(data2){
                console.log(data2);
                listMovies(data2);
            })
            
        } else {
            alert('Error: Actor Not Found');
        }
    });
}

var nextval=0;
var listMovies=function(data2){
    for (var i=0; i<Math.min(10,data2.cast.length); i++){
        var movieCardEl=document.createElement("card");
        $(movieCardEl).class("movieCard");
        var posterLink="https://image.tmdb.org/t/p/w500"+data2.cast[i+nextval].poster_path;
        var postEl=document.createComment("img");
        $(postEl).class("moviePoster").attr("href",posterLink);

        //add poster element
        var movieName=data2.cast[i+nextval].title;
        var movieID=data2.cast[i+nextval].id;
        //pass this information to the next page;
        var titleEl=document.createElement("h3");
        //add title
            $(titleEl).class("movieTitle").text(movieName).attr("movieID",movieID);
        var releaseDate=data2.cast[i+nextval].release_date;
        //add releaseDate
        
        // appendchild to the parent element card
        // appendchild to the parent container
    }

}


actorData=getActorInfo();

actorMovie=getActorMovies();

//eventlistener to next button