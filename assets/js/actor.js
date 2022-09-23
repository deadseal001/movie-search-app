
var searchInput="tom+cruise";//get this info from search box
var getIDUrl="https://api.themoviedb.org/3/search/multi?api_key=074915bcf109483ca070f5358f0e524b&language=en-US&query="+searchInput;//two or more words linked with +//change api key with yours
var search=function(){
    fetch(getIDUrl).then(function (IDresponse) {
        if (IDresponse.ok){
            console.log(IDresponse);
            IDresponse.json().then(function(IDdata){
                //displayRepos(data.items,language)
                console.log(IDdata);
                // list search results
                // case "media_type"=person show person name and profile
                    //click link to send to page2
                // case "media_type"=movie show movie name and profile 
                    //click lind and send to page3
            })
        } else {
            alert('Error: Actor Not Found');//have to change to modal
        }
    });
}

//click search button to call search function
search();



var actorID="31";
var actorApiUrl="https://api.themoviedb.org/3/person/"+actorID+"?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
var actorMovieUrl="https://api.themoviedb.org/3/person/"+actorID+"/movie_credits?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
var getActorInfo=function (){
    fetch(actorApiUrl).then(function (response) {
        if (response.ok){
            response.json().then(function(data){
                //displayRepos(data.items,language)
                console.log(data);
                $("#actorname").text(data.name);
                $("#dob").text("Birthday: "+ data.birthday);
                $("#birthPlace").text("Place of Birth: "+ data.place_of_birth);
                $("#known").text("Known for: "+ data.known_for_department);
                $("#bio").text("Biography: "+ data.biography);
                $("#link").text(data.homepage).attr("href",data.homepage);
            })
            console.log(response);
        } else {
            alert('Error: Actor Not Found');//have to change to modal
        }
    });
    fetch(actorMovieUrl).then(function (response2) {
        if (response2.ok){
            console.log(response2);
            response2.json().then(function(data2){
                //movie good
                console.log(data2);
            })
            
        } else {
            alert('Error: Actor Not Found');//have to change to modal
        }
    });
}


actorData=getActorInfo();

//search/person need to try this to get id
//https://api.themoviedb.org/3/search/person?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
var searchUrl="https://api.themoviedb.org/3/search/movie?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
// fetch(searchUrl).then(function (response3) {
//     if (response3.ok){
//         console.log(response);
//         response3.json().then(function(data){
//             //displayRepos(data.items,language)
//             console.log(data);
//             // $("#actorname").text(data.name);
//             // $("#dob").text("Birthday: "+ data.birthday);
//             // $("#birthPlace").text("Place of Birth: "+ data.place_of_birth);
//             // $("#known").text("Known for: "+ data.known_for_department);
//             // $("#bio").text("Biography: "+ data.biography);
//             // $("#link").text(data.homepage).attr("href",data.homepage);
//         })
        
//     } else {
//         alert('Error: Actor Not Found');//have to change to modal
//     }
// });