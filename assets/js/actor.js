var actorName="tom hanks";
var actorApiUrl="https://api.themoviedb.org/3/person/"+actorName+"?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
var actorMovieUrl="https://api.themoviedb.org/3/keyword/"+actorName+"?api_key=074915bcf109483ca070f5358f0e524b&language=en-US"
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
                //displayRepos(data.items,language)
                console.log(data2);
            })
            
        } else {
            alert('Error: Actor Not Found');//have to change to modal
        }
    });
}
actorData=getActorInfo();

//search/person need to try this to get id
