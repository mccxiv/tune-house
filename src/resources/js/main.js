

var App = App || {instances: {}, classes: {}, config: {}};

$(document).on('click', '.track', addThisTrackToQueue);
$(document).on('click', '.play-all', playAllTracks);
$(document).on('change', '.volume-slider', saveNewVolume);
$(document).on('click', '.search', function() {$('.search-query').focus();});
$(document).on('wheel', '.queue-tracks', scrollQueue);

/* INIT */
$(document).ready(documentReady);
$(window).load(windowLoaded);