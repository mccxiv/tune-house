
function documentReady()
{
	// Order matters because of dependencies
	App.instances.router = new App.classes.AppRouter();
	App.instances.spinner = new Spinner();
	App.instances.notif = new Notifications();
	App.instances.api = new LastFMAPI(CONFIG.LASTFM_API_KEY);
	App.instances.queue = new Queue();
	Backbone.history.start();

	// boostrap stuff
	$('.btn').button();
	/*$('.search-bar').popover(
		{
			placement: 'bottom',
			trigger: 'manual',
			content: 'Tab to change'
		});*/

	// load saved volume
	if (localStorage && localStorage.volume) $('.volume-slider').val(localStorage.volume).trigger('input');

	// Show tip
	/*setTimeout(function()
	{
		var sb = $('.search-bar');
		sb.popover('show');
		setTimeout(function() {sb.popover('hide');}, 3000);
	}, 2000);*/
}

function windowLoaded()
{
	$('html').addClass('loaded');
}

function playAllTracks()
{
	console.log('playing all');
	var executeIn = 0;
	$('.track').each(function()
	{
		var track = this;
		setTimeout(function() {$(track).click();}, executeIn);
		executeIn += 100;
	});
}

function saveNewVolume()
{
	var vol = $('.volume-slider').val();
	if (localStorage) localStorage.volume = vol;
}

function addThisTrackToQueue(e)
{
	e.preventDefault();
	var trackDom = $(this);
	var artist = trackDom.data('artist');
	var title = trackDom.data('title');
	var trackName = artist+' - '+title;

	App.instances.queue.addTrack(trackName, function(status, ytTitle)
	{
		if (status) App.instances.notif.new('success', 'added: ' + ytTitle);
		else
		{
			console.log('could not get track: ' + title);
			App.instances.notif.new('danger', 'could not obtain: ' + title);
		}
	});
}

function scrollQueue(event)
{
	this.scrollLeft += (event.originalEvent.deltaY);
	event.preventDefault();
}