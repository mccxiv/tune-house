
var LASTFM_API_KEY = 'a321fbc695a201f18a34fd35fdd5a2e9';
var YOUTUBE_API_KEY = 'AIzaSyD4v--K9ISqITk-Iub3JkjinmEORr83Ufc';
var App = App || {instances: {}, classes: {}, config: {}};

$(document).on('click', '.track', addThisTrackToQueue);
$(document).on('click', '.play-all', playAllTracks);
$(document).on('change', '.volume-slider', saveNewVolume);
$(document).on('click', '.search', function() {$('.search-query').focus();});
$(document).on('wheel', '.queue-tracks', scrollQueue);

/* INIT */
$(document).ready(documentReady);
$(window).load(windowLoaded);