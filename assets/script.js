document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
});

//target the search button for a click event
var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", logLyric);
searchBtn.addEventListener("keypress", logLyric);

var inputBox = document.getElementById("Search");
var lyric = "";

if (localStorage.getItem("recently searched") == null) {
  localStorage.setItem("recently searched", "[]");
}

let recentlySearched = JSON.parse(localStorage.getItem("recently searched"));

let clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", clearSearched);

setButtons();

function logLyric() {
  lyric = inputBox.value;

  console.log("current search term: ",lyric);
  localStorage.setItem("current search term", JSON.stringify(lyric));

  addToRecentSearch();

  var mXm =
    "https://proxy.cors.sh/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=" +
    lyric +
    "&apikey=38bfab1d78863e402542205e1d2d9257";
  fetchData(mXm);
}
//take input and fetch song data from musixmatch
function fetchData(mXm) {
  inputBox.value = "";
  fetch(mXm, {
    headers: {
      // allows us to bypass the CORS error,
      // will need to replace temp api key at some point
      "x-cors-api-key": "temp_df6e303c39b09caae7dff0d19e5a319c",
    },
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data.message.body);
      localStorage.setItem("musicSearch", JSON.stringify(data));
      displayMusicmatch();
    });
}
console.log("top");

function displayMusicmatch() {
  // this is removes old search results if present
  $("#resultsList").empty();
  // this is the local storage that shows the the results from the search
  var musicList = JSON.parse(localStorage.getItem("musicSearch"));
  console.log(musicList);
  var list = $("<ul>");
  // just pulling info from the music match to a local var
  var track_list = musicList.message.body.track_list;
  for (let i = 0; i < track_list.length; i++) {
    var listItem = $("<li>");
    var thumbnailItem = $("<a>");
    // Gets the link to navigate to a new tab
    thumbnailItem.attr("target", "_blank");
    var source = track_list[i].track.track_share_url;
    // this is the link href
    thumbnailItem.attr("href", source);
    // this is what appears on the list to click on to go to the music match
    var track_name = track_list[i].track.track_name;
    var artist_name = track_list[i].track.artist_name;
    var resultsLabel =
      "ARTIST NAME: " + artist_name + "\n" + "TRACK NAME: " + track_name;
    listItem.text(resultsLabel);
    thumbnailItem.append(listItem);
    list.append(thumbnailItem);
    // build a function to fire the youtube API that matches the results of the music match API and goes to the youtube player on
    // a new window and plays the video
  }
  $("#resultsList").append(list);

  youTubeAPI();
}

// Examples so I don't forget
// GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=Ks-_Mh1QhMc&type=video&key=[YOUR_API_KEY] HTTP/1.1

// Hope's youtube API key:
const ytkey = "AIzaSyA4D1jpi2mpVlAlUO9TWKG2mxPCDFda1l4";

// LaShawn's youtube API key:
// const key = "AIzaSyD2OrpKeJ6CUDPO-oZ5KB2mmLdWD0PSh8c";

// this function currently returns youtube videos matching the user input,
// can we store the musixmatch data and run through here so youtube vids match musixmatch songs?

// https://www.youtube.com/watch?v=-WowH0liGfE


function youTubeAPI() {
  var input = localStorage.getItem("current search term")
  var youTube =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&relevanceLanguage=en&topicId=/m/04rlf&q=" +
    input +
    "&type=video&key=" +
    ytkey;
  fetch(youTube)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      localStorage.setItem("youtubeSearch", JSON.stringify(data));
      displayYouTube(data);
    })
    .catch((e) => {
      console.log("here is the error", e);
    });
    displayYouTube();
}

//display youtube data
// creates a list item for each returned youtube video

function displayYouTube() {
  // this is removes old search results if present
  $("#youtube-title").empty();
  // this is the local storage that shows the the results from the search
  var ytList = JSON.parse(localStorage.getItem("youtubeSearch"));
  console.log(ytList);
  var list = $("<ul>");
  // just pulling info from the youtube to a local var
  var youtube_list = ytList.items;
  for (let i = 0; i < youtube_list.length; i++) {
    var listItem = $("<li>");
    var youtubeItem = $("<a>");
    // Gets the link to navigate to a new tab
    youtubeItem.attr("target", "_blank");
    var source =
      "https://www.youtube.com/watch?v=" + youtube_list[i].id.videoId;
    // this is the link href
    youtubeItem.attr("href", source);
    // this is what appears on the list to click on to go to the music match
    var youtube_video = youtube_list[i].snippet.title;
    var youtubeName = "Video Name " + youtube_video;
    listItem.text(youtubeName);
    youtubeItem.append(listItem);
    list.append(youtubeItem);
  }
  $("#youtube-title").append(list);
}

function addToRecentSearch() {
  lyric = inputBox.value;
  let currentSearch = lyric;

  recentlySearched.push(currentSearch);

  localStorage.setItem("recently searched", JSON.stringify(recentlySearched));

  let newBtn = document.createElement("button");
  newBtn.setAttribute("class", "waves-effect waves-light btn");
  newBtn.textContent = currentSearch;
  newBtn.setAttribute("class", "waves-effect waves-light btn");
  previouslySearched.appendChild(newBtn);
  newBtn.addEventListener("click", doItAgain);

  function doItAgain() {
    lyric = newBtn.textContent;
    localStorage.setItem("current search term", lyric);

    var mXm =
      "https://proxy.cors.sh/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=" +
      lyric +
      "&apikey=38bfab1d78863e402542205e1d2d9257";
    fetchData(mXm);
  }
}

function setButtons() {
  for (let i = 0; i < recentlySearched.length; i++) {
    let lyricBtn = document.createElement("button");
    lyricBtn.setAttribute("class", "waves-effect waves-light btn");
    lyricBtn.textContent = recentlySearched[i];
    let previouslySearched = document.getElementById("previouslySearched");
    previouslySearched.appendChild(lyricBtn);
    lyricBtn.addEventListener("click", logLyricAgain);

    function logLyricAgain() {
      lyric = lyricBtn.textContent;
      localStorage.setItem("current search term", lyric);

      var mXm =
        "https://proxy.cors.sh/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=" +
        lyric +
        "&apikey=38bfab1d78863e402542205e1d2d9257";
      fetchData(mXm);
    }
  }
}

// clears the search history and reloads the page
function clearSearched() {
  localStorage.removeItem("recently searched");
  window.location.reload();
}



console.log("top5");

var searchBtn = $("#searchBtn");

searchBtn.ready(function () {
  $("#Search").keydown(function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      searchMe();
    }
  });
});

function searchMe() {
  var input = $("#Search").val();
  console.log("searching: ", input);
  $("#youtube-title").empty();
  $("#youtube-title").text(input);
  youTubeAPI(input);
}

searchBtn.click(searchMe);

console.log("top6");

// youtube API key
const key = "AIzaSyD2OrpKeJ6CUDPO-oZ5KB2mmLdWD0PSh8c";
const muskey = "1b483628365d407895a612635af439ad";
console.log("top2");

//!Please don't delete anything below this :)
//functions for filterPanel
let selectedGenreArr = [];
let selectedArtistArr = [];
let selectedLyricsArr = [];
let genre;
let artist;
let lyrics;

// searchGenre();
function filterByGenre() {
  $("#filterApplyButton").show();
  let genre = $("#filterByGenre").prop("checked");
  let priorGenreSearched = $("#searchPriorGenre").attr("priorvalue");
  if (genre) {
    selectedGenreArr.push(["add", "filter", "SEARCH_GENRE"]);
  } else if (genre != priorGenreSearched) {
    selectedGenreArr.push(["delete", "filter", "SEARCH_GENRE"]);
  }
}

// searchArtist();
console.log(1);
function filterByArtist() {
  let artist = $("#filterByArtist").prop("checked");
  let priorArtistSearched = $("#searchPriorAritst").attr("priorvalue");
  if (artist) {
    selectedArtistArr.push(["add", "filter", "SEARCH_ARTIST"]);
  } else if (artist != priorArtistSearched) {
    selectedArtistArr.push(["delete", "filter", "SEARCH_ARTIST"]);
  }
}
console.log(2);

//searchLyrics();
console.log(3);
function filterByLyrics() {
  let lyrics = $("#filterByLyrics").prop("checked");
  let priorLyricsSearched = $("#searchPriorLyrics").attr("priorvalue");
  if (lyrics) {
    selectedLyricsArr.push(["add", "filter", "SEARCH_LYRICS"]);
  } else if (lyrics != priorLyricsSearched) {
    selectedLyricsArr.push(["delete", "filter", "SEARCH_LYRICS"]);
  }
  filtersImplemented();
}
console.log(4);

//implement filters
function filtersImplemented(e) {
  e.preventDefault();
  console.log("filter fired");
  let combinedArr = selectedGenreArr
    .concat(selectedArtistArr)
    .concat(selectedLyricsArr);
  let filtersImplemented = {
    searchChanges: JSON.stringify(combinedArr),
    filterByGenre: genre,
    filterByArtist: artist,
    filterByLyrics: lyrics,
  };
  console.log(combinedArr, "combined Array");

  //!working on this. still not getting it. don't delete :)
  // let baseUrl =
  // fetch(
  //   `https://corsproxylyricallydemo.herokuapp.com/https://api.musixmatch.com/ws/1.1/genre.get?genre_id=118&apikey=${temp_211e4d54773c2e03893b97b548ed8d74}`
  // ).concat(fetch(fetch(
  //   `https://corsproxylyricallydemo.herokuapp.com/https://api.musixmatch.com/ws/1.1/artist.get?artist_id=118&apikey=${temp_211e4d54773c2e03893b97b548ed8d74}`
  // ))).concat(fetch(fetch(
  //   `https://corsproxylyricallydemo.herokuapp.com/https://api.musixmatch.com/ws/1.1/lyrics.get?lyric_id=118&apikey=${temp_211e4d54773c2e03893b97b548ed8d74}`
  // )));
  $.ajax(baseUrl).done(function (response) {
    doSearch(filtersImplemented);
    console.log(response);
  });
}
//filtersImplemented(e); //!working DO NOT DELETE!!!!
var applyFiltersButton = $("#filterApplyButton");
applyFiltersButton.on("click", filtersImplemented);