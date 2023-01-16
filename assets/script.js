
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
});

//target the search button for a click event
var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", logLyric);

//
function logLyric() {
  var inputBox = document.getElementById("Search");
  var lyric = inputBox.value;
  console.log(lyric);
  var mXm =
    "https://proxy.cors.sh/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=" +
    lyric +
    "&apikey=f5675484f5751c3529bca2ad13ec32fd";
  fetchData(mXm);
}
  //take input and fetch song data from musixmatch
  function fetchData(mXm) {
    fetch(mXm, {
      headers: {
        // allows us to bypass the CORS error, 
        // will need to replace temp api key before presentation (expires on sunday)
        "x-cors-api-key": "temp_211e4d54773c2e03893b97b548ed8d74",
      }
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })      .then(function (data) {
        console.log(data.message.body);
        localStorage.setItem("musicSearch",JSON.stringify(data))
        displayMusicmatch()
      })
    }
console.log("top")

function displayMusicmatch() {
  // this is removes old search results if present 
  $("#resultsList").empty();
  // this is the local storage that shows the the results from the search 
  var musicList = JSON.parse(localStorage.getItem("musicSearch"))
  console.log(musicList)
  var list = $("<ul>");
  // just pulling info from the music match to a local var 
  var track_list = musicList.message.body.track_list
  for (let i = 0; i < track_list.length; i++) {
    var listItem = $("<li>");
    var thumbnailItem = $("<a>")
    // Gets the link to navigate to a new tab
    thumbnailItem.attr("target","_blank")
    var source = track_list[i].track.track_share_url
    // this is the link href 
  thumbnailItem.attr('href', source)
  // this is what appears on the list to click on to go to the music match
  var track_name = track_list[i].track.track_name
  var artist_name  = track_list[i].track.artist_name
  var resultsLabel = "ARTIST NAME: " + artist_name + "\n" + "TRACK NAME: " + track_name
  listItem.text(resultsLabel)
  thumbnailItem.append(listItem)
  list.append(thumbnailItem);
  // build a function to fire the youtube API that matches the results of the music match API and goes to the youtube player on 
  // a new window and plays the video
  }
  $("#resultsList").append(list);
}


// Examples so I don't forget
// GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=Ks-_Mh1QhMc&type=video&key=[YOUR_API_KEY] HTTP/1.1


// Hope's youtube API key:
// const key = "AIzaSyA4D1jpi2mpVlAlUO9TWKG2mxPCDFda1l4";


// LaShawn's youtube API key:
// const key = "AIzaSyD2OrpKeJ6CUDPO-oZ5KB2mmLdWD0PSh8c"

// this function currently returns youtube videos matching the user input,
// can we store the musixmatch data and run through here so youtube vids match musixmatch songs?

// https://www.youtube.com/watch?v=-WowH0liGfE



//target the search button for a click event
var youTubebtn = document.getElementById("youTubebtn");
youTubebtn.addEventListener("click", youTubeAPI);
console.log("youTubebtn")


function youTubeAPI() {
  var input = document.getElementById("Search").value;
  var youTube =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
  input +
  "&type=video&key=" +
  key;
  fetch(youTube)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    localStorage.setItem("youtubeSearch",JSON.stringify(data))
    displayYouTube(data);
  }).catch(e => {
    console.log('here is the error', e)
  });
}


//display youtube data
// creates a list item for each returned youtube video

function displayYouTube() {
  // this is removes old search results if present 
  $("#youtube-title").empty();
  // this is the local storage that shows the the results from the search 
  var ytList = JSON.parse(localStorage.getItem("youtubeSearch"))
  console.log(ytList)
  var list = $("<ul>");
  // just pulling info from the youtube to a local var 
  var youtube_list = ytList.items
  for (let i = 0; i < youtube_list.length; i++) {
    var listItem = $("<li>");
    var youtubeItem = $("<a>")
    // Gets the link to navigate to a new tab
    youtubeItem.attr("target","_blank")
    var source = "https://www.youtube.com/watch?v=" + youtube_list[i].id.videoId
    // this is the link href 
  youtubeItem.attr('href', source)
  // this is what appears on the list to click on to go to the music match
  var youtube_video = youtube_list[i].snippet.title
  var youtubeName = "Video Name " + youtube_video
  listItem.text(youtubeName)
  youtubeItem.append(listItem)
  list.append(youtubeItem);
  }
  $("#youtube-title").append(list);
}

$("#youTubebtn").on("click", function( ){
  var input = $("#Search").val()
  console.log("click ", input)
  $("#youtube-title").empty()
  $("#youtube-title").text(input)
  youTubeAPI(input)
  })
  
  
console.log("top6")

// youtube API key
const key = "AIzaSyD2OrpKeJ6CUDPO-oZ5KB2mmLdWD0PSh8c";
const muskey = "1b483628365d407895a612635af439ad"
console.log("top2")


//functions for filterPanel
let selectedGenreArr = [];
let selectedArtistArr = [];
let selectedLyricsArr = [];

function searchByGenre() {
  $("#filterApplyButton").show();
  let genreFilter = $("#searchByGenre").prop("checked");
  let priorGenreSearched = $("#searchPriorGenre").attr("priorvalue");
  if (genreFilter) {
    selectedGenreArr.push(["add", "filter", "SEARCH_BY_GENRE"]);
  } else if (genreFilter != priorGenreSearched) {
    selectedGenreArr.push(["delete", "filter", "SEARCH_BY_GENRE"]);
  }
}
// searchGenre();
console.log(1);

function searchArtist() {
  let priorArtistSearched = $("#searchPriorAritst").attr("priorvalue");
  if (artist) {
    selectedArtistArr.push(["add", "filter", "SEARCH_ARTIST"]);
  } else if (artist != priorArtistSearched) {
    selectedArtistArr.push(["delete", "filter", "SEARCH_ARTIST"]);
  }
}
console.log(2);
// searchArtist();

function filtersImplemented(e) {
  e.preventDefault();
  console.log("filter fired");
  let combinedArr = selectedGenreArr.concat(selectedArtistArr);
  let filtersImplemented = {
    searchChanges: JSON.stringify(combinedArr),
    showGenre: genre,
    showArtist: artist,
  };
  let baseUrl =
    "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_artist=justin%20bieber&page_size=3&page=1&s_track_rating=desc&apikey=8eb4ed7bb8315a88d7fe11ff7b000ef1";
  //  + genre + "&showArtist=" + artist;
  $.ajax(baseUrl).done(function (response) {
    doSearch(filtersImplemented);
    console.log(response);
  });
}
//filtersImplemented(e); //!Not working
//e.addEventListener("click", filtersImplemented);


  function searchByArtist() {
    let artistFilter = $("#searchByArtist").prop("checked");
    let priorArtistSearched = $("#searchPriorArtist").attr("priorvalue");
    if (artistFilter) {
      selectedArtistArr.push(["add", "filter", "SEARCH_BY_ARTIST"]);
    } else if (artistFilter != priorArtistSearched) {
      selectedArtistArr.push(["delete", "filter", "SEARCH_BY_ARTIST"]);
    }
  }
  console.log(2);
  // searchByArtist();

  function filterByLyrics() {
    let lyricsFilter = $("#searchByLyrics").prop("checked");
    let priorLyricsSearched = $("#searchPriorArtist").attr("priorvalue");
    if (lyricsFilter) {
      selectedArtistArr.push(["add", "filter", "SEARCH_BY_LYRICS"]);
    } else if (lyricsFilter != priorLyricsSearched) {
      selectedLyricsArr.push(["delete", "filter", "SEARCH_BY_LYRICS"]);
    }
  }
  console.log(2);
  // searchByLyrics();



  function filtersImplemented(e) {
    e.preventDefault();
    console.log("filter fired")
    let combinedArr = selectedGenreArr.concat(selectedArtistArr);
    let filtersImplemented = {
      searchChanges: JSON.stringify(combinedArr),
      showGenre: genre,
      showArtist: artist,
    };
    let baseUrl = "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_artist=justin%20bieber&page_size=3&page=1&s_track_rating=desc&apikey=8eb4ed7bb8315a88d7fe11ff7b000ef1"
    //  + genre + "&showArtist=" + artist;
    $.ajax(baseUrl).done(function(response) {
      doSearch(filtersImplemented);
      
      console.log(response);
    });
  }
  //filtersImplemented(e); //!working DO NOT DELETE!!!!
  var applyFiltersButton = $('#filterApplyButton')
  applyFiltersButton.on("click", filtersImplemented);

