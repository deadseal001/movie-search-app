var searchList=["tom cruise","tom hanks"];//["tom curise","tom hanks"]
var IdString=document.location.search;
console.log(IdString);

function saveSearchList(){
    console.log(searchList);
    localStorage.setItem("movieSearchList",JSON.stringify(searchList));
}

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
        document.getElementById("clearBtn").style.visibility="visible";
    }
};

//function add new search to the searchList
function addSearchList(words){
    console.log(words);

    for (i=0; i<searchList.length;i++) {
        if (words === searchList[i]){
            searchList.splice(i,1);
        }
    }
    console.log(searchList);
    console.log(words);
    searchList.push(words);
    saveSearchList(searchList);
    loadSearchList();
}


function clearList(){
    $(".listBtn").remove();
    searchList=[];
    saveSearchList();
    loadSearchList();
    document.getElementById("clearBtn").style.visibility="hidden";
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


function searchFunc(keyword, words) {
    console.log(keyword);
    console.log(words);
    $(".personCard").remove();
    var getIDUrl="https://api.themoviedb.org/3/search/multi?api_key=074915bcf109483ca070f5358f0e524b&language=en-US&query="+keyword; 
    fetch(getIDUrl).then(function (response) {
        if (response.ok){
            // console.log(IDresponse);
            response.json().then(function(data){
                console.log(data);
                // list search results
                var nullcount=0;
                for (var i=0; i<data.results.length; i++) {
                    switch(data.results[i].media_type){
                        case "person":
                            addperson(data,i);
                            break;
                        case "movie":
                            addmovie(data,i);
                            break;
                        default:
                            nullcount++;
                    }
                }
                if (nullcount === data.results.length) {
                    callmodal("Error! "+words+"Not Found.");
                } else {
                    addSearchList(words);// add button save and load
                }
            })
        } else {
            callmodal("Error! "+words+"Not Found.");
        }
    });

}

function addperson(data,i){
    var containerEl=document.querySelector(".container");
        var personCardEl=document.createElement("div");
            personCardEl.classList="personCard bg-black-300/0.5";
            var postercontainerEl=document.createElement("div");
                postercontainerEl.classList="posterdiv bg";
                var posterEl=document.createElement("img");
                    posterEl.classList="poster link"
                    posterEl.setAttribute("src","https://image.tmdb.org/t/p/w500"+data.results[i].profile_path);
                    posterEl.setAttribute("alt",data.results[i].name);
                    posterEl.setAttribute("data-id",data.results[i].id);
                    posterEl.setAttribute("data-type",data.results[i].media_type);
            postercontainerEl.appendChild(posterEl);
        personCardEl.appendChild(postercontainerEl);
            var infocontainerEl=document.createElement("ul");
                infocontainerEl.classList="infodiv bg"
                var media_typeEl=document.createElement("li");
                    media_typeEl.textContent="Media Type: "+ data.results[i].media_type;
                var knownForEl=document.createElement("li");
                    knownForEl.textContent="Known For: "+ data.results[i].known_for_department;
                var nameEl=document.createElement("li");
                    nameEl.classList="name link";
                    nameEl.textContent="Name: " + data.results[i].name;
                    nameEl.setAttribute("data-id",data.results[i].id);
                    nameEl.setAttribute("data-type",data.results[i].media_type);
            infocontainerEl.appendChild(media_typeEl);
            infocontainerEl.appendChild(knownForEl);
            infocontainerEl.appendChild(nameEl);
        personCardEl.appendChild(infocontainerEl); 
    containerEl.appendChild(personCardEl);
}

function addmovie(data,i) {
    var containerEl=document.querySelector(".container");
        var personCardEl=document.createElement("div");
            personCardEl.classList="personCard bg-black-500/0.5";
            var postercontainerEl=document.createElement("div");
                postercontainerEl.classList="posterdiv bg";
                var posterEl=document.createElement("img");
                    posterEl.classList="poster link"
                    posterEl.setAttribute("src","https://image.tmdb.org/t/p/w500"+data.results[i].poster_path);
                    posterEl.setAttribute("alt",data.results[i].title);
                    posterEl.setAttribute("data-id",data.results[i].id);
                    posterEl.setAttribute("data-type",data.results[i].media_type);
            postercontainerEl.appendChild(posterEl);
        personCardEl.appendChild(postercontainerEl);
            var infocontainerEl=document.createElement("ul");
                infocontainerEl.classList="infodiv bg"
                var media_typeEl=document.createElement("li");
                    media_typeEl.textContent="Media Type: "+ data.results[i].media_type;
                var dateEl=document.createElement("li");
                    dateEl.textContent="Release Date: "+ data.results[i].release_date;
                var nameEl=document.createElement("li");
                    nameEl.classList="name link";
                    nameEl.textContent="Title: " + data.results[i].title;
                    nameEl.setAttribute("data-id",data.results[i].id);
                    nameEl.setAttribute("data-type",data.results[i].media_type);
            infocontainerEl.appendChild(media_typeEl);
            infocontainerEl.appendChild(nameEl);
            infocontainerEl.appendChild(dateEl);
        personCardEl.appendChild(infocontainerEl); 
    containerEl.appendChild(personCardEl);
}



//bottom of the js
//check if document.location.search has information to process
if(IdString != ""){
    var searchKeyWord= IdString.split("=")[1];
    var searchWordArr=searchKeyWord.split("+");
    var words = searchWordArr[0];
    for (i=1; i<searchWordArr.length; i++){
        words=words+" "+searchWordArr[i];
    }
    $('#error-modal').modal('hide');
    console.log(words);
    loadSearchList();
    searchFunc(searchKeyWord,words);

} else {
    // saveSearchList();
    loadSearchList();
    $('#error-modal').modal('hide');
}


$(".searchList").on("click", ".listBtn", function(){
    var searchwords=$(this).text();
    console.log(searchwords);
    var searchWordArr=searchwords.split(" ");
    console.log(searchWordArr);
    var searchKeyWord=searchWordArr[0];
    for (var i=1; i<searchWordArr.length; i++){
        searchKeyWord=searchKeyWord+"+"+searchWordArr[i];
    }
    console.log(searchKeyWord);
    searchFunc(searchKeyWord,searchwords);
})

$("#clearBtn").on("click", clearList);

var searchFormEl=document.querySelector(".search-form");
var searchBoxEl=document.querySelector(".searchBox");
function formSubmitHandler(event){
    event.preventDefault();
    var words= searchBoxEl.value.trim();

    console.log(words);
    if (words==""){
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
        searchFunc(queryStr, words);
    }
}

$(searchFormEl).on("submit", formSubmitHandler);

$(".container").on("click",".link", function(){
    var type=$(this).attr("data-type");
    var id=$(this).attr("data-id");
    switch (type) {
        case "person":
            window.location.href="./actors.html?actorid="+id;
            break;
        case "movie":
            window.location.href="./trailers.html?movieid="+id;

    }
})