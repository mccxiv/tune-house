
function Queue()
{
    var player = null;
    this.getPlayer = function() {return player;};
    var key = YOUTUBE_API_KEY;
    var queueDom = $('.queue');
    var queueTracks = queueDom.find('.queue-tracks');
    var trackTemplate = _.template($('.queue-track-template').html());
    
    function error(msg)
    {
		console.log('ERROR:');
		console.log(msg);
    }
    
    function play()
    {
		player.playVideo();
    }
    
    function pause()
    {
		player.pauseVideo();
    }
    
    /* GET */
    
    function getRepeatStatus()
    {
		return $('.repeat-button').prop('checked');
    }
    
    function getShuffleStatus()
    {
		return $('.shuffle-button').prop('checked');
    }
    
    function getNextVideo()
    {
	
    }
    
    
    /* INTERNAL EVENT HANDLERS */
    
    function onPlayerStateChange(state)
    {
		switch (state.data)
		{
			case YT.PlayerState.ENDED: onEnd(); break;
			case YT.PlayerState.PLAYING: onPlay(); break;
			case YT.PlayerState.PAUSED: onPause(); break;
		}
    }
    
    function onPlayerReady()
    {
		updateDuration();
		updateVolume();
		play();
    }
    
    function onEnd()
    {
		removeStateActive();
		resetSeekbar();
		closeVideo();
		playNext();
    }
    
    function onPause()
    {
		setPlayButtonStatus(true);
    }
    
    function onPlay()
    {
		setPlayButtonStatus(false);
		startTimeUpdater();
    }
    
    /* ACTIONS */
    
    // Track states, only one track can have a given state at a time
    // handled automatically
    function setStateActive(dom)
    {
		$('.queue-track').removeClass('queue-track-active');
		$(dom).addClass('queue-track-active');
    }
    
    function setStateLastPlayed(dom)
    {
		$('.queue-track').removeClass('queue-last-played');
		$(dom).addClass('queue-last-played');
    }
    
    function setStateShufflePlayed(dom)
    {
		$(dom).addClass('shuffle-played');
    }
    
    function removeStateActive()
    {
		$('.queue-track').removeClass('queue-track-active');
    }
    
    function getActiveTrack()
    {
		return $('.queue-track-active').get(0);
    }
    
    function getLastPlayed()
    {
		return $('.queue-last-played').get(0);
    }
    
	function setPlayButtonStatus(isPaused)
	{
		if (isPaused) $('.play-button .glyphicon').removeClass('glyphicon-pause').addClass('glyphicon-play');
		else $('.play-button .glyphicon').removeClass('glyphicon-play').addClass('glyphicon-pause');
	}
	
    function seekTo(seconds)
    {
		// TODO refine to allow updating while dragging
		player.seekTo(seconds, true);
    }
    
    function resetSeekbar()
    {
		$('.current-time').html('0:00');
		$('.duration').html('0:00');
		$('.seek-slider').val(0);
    }
    
    function startTimeUpdater()
    {	
		var i = setInterval(setTime, 1000);

		function setTime()
		{
			if (player && player.getPlayerState)
			{
				if (player.getPlayerState() !== YT.PlayerState.PLAYING) clearInterval(i);
				var percentage = (player.getCurrentTime() / player.getDuration()) * 100;
				$('.seek-slider').val(percentage);
				updateCurrentTime();
			}

			else clearInterval(i);
		}
    }
    
    function startNewVideo(domElement)
    {
		App.instances.notif.new('success', 'playing: ' + $(domElement).data('title'));
		setStateActive(domElement);
		setStateLastPlayed(domElement);
		if (getShuffleStatus()) setStateShufflePlayed(domElement);	
		closeVideo();
		loadVideoToContainer(domElement);
    }
    
    function closeVideo()
    {
		if (player && player.destroy) player.destroy();
		player = null;
    }
    
    function removeTrack(dom)
    {
		var jqdom = $(dom);
		if (getActiveTrack() === dom) closeVideo();
		jqdom.tooltip('destroy');

		resetSeekbar();
		setPlayButtonStatus(true);
		
		jqdom.addClass('queue-track-hidden');
		setTimeout(function()
		{
			jqdom.remove();	
		}, 150);	
    }
    
    function playNext()
    {
		var next;

		if (getRepeatStatus() && !getShuffleStatus()) next = getLastPlayed();
		else if (getShuffleStatus()) 
		{
			var candidates;

			if (getRepeatStatus()) candidates = $('.queue-track:not(.last-played)');
			else 
			{
				candidates = $('.queue-track:not(.last-played):not(.shuffle-played)');
				if (candidates.length === 0) 
				{
					// shuffle's work is done here, the playlist has ended
					// so clear the list of played songs
					$('.queue-track').removeClass('shuffle-played');
				}
			}

			var qty = candidates.length;
			if (qty !== 0)
			{
				var random = Math.floor(Math.random() * qty);
				next = candidates.eq(random).get(0);
			} 
		}
		else next = $(getLastPlayed()).next().get(0);

		if (next) startNewVideo(next);
		else return false;
    }
    
    function updateVolume()
    {
		var vol = $('.volume-slider').val();
		if (player && player.setVolume) player.setVolume(vol);	
    }
    
    function updateDuration()
    {
		var d = secondsToMinutesSeconds(player.getDuration());
		$('.duration').html(d);
    }
    
    function updateCurrentTime()
    {
		var t = secondsToMinutesSeconds(Math.round(player.getCurrentTime()));
		$('.current-time').html(t);
    }    
    
    function loadVideoToContainer(dom)
    {
		var jqdom = $(dom);

		player = new YT.Player(jqdom.find('.video').get(0), 
		{
			height: '56',
			width: '100',
			videoId: jqdom.data('id'),
			playerVars:
			{
				controls: 0,
				showinfo: 0,
				disablekb: 1,
				iv_load_policy: 3,
				modestbranding: 1,
				rel: 0,
				origin: '*'
			},
			events: 
			{
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
    }
    
    this.addTrack = function(title, callback)
    {
		App.instances.spinner.start();
		
		// TODO for responsiveness show the box sooner, load in data later
		searchVideo(title, function(api)
		{
			if (api.items[0])
			{
				var dom = $(trackTemplate(api));
				queueTracks.append(dom);

				// entry animation and bootstrap's tooltip
				$(dom).tooltip();

				// there's no active track so start it
				if (!getActiveTrack()) startNewVideo(dom);		

				// transition won't work without timeout
				// TODO figure out why
				setTimeout(function()
				{
					$(dom).removeClass('queue-track-hidden');
				}, 10);

				callback(true, api.items[0].snippet.title);
			}

			else
			{
				error('Song not found');
				callback(false);
			}

			App.instances.spinner.end();
		}, 
		function() 
		{
			callback(false);
			App.instances.spinner.end();
		});
    };
    
    
    /* HELPERS */
    
    // search by title, callback gets api response
    function searchVideo(title, callback)
    {
        var url = 'https://www.googleapis.com/youtube/v3/search';
        
        $.ajax(
        {
            dataType: 'jsonp',
            url: url,
            data: {key: key, part: 'snippet', type: 'video', maxResults: 1, q: title, videoCategoryId: 10, videoEmbeddable: true},
            error: function() {callback(false);},
            success: function(data) {callback(data);}
        });
    }
    
    function secondsToMinutesSeconds(seconds)
    {
		var m = Math.floor(seconds / 60);
		var s = (seconds - m * 60) + '';
		if (s.length < 2) s = '0' + s;
		return '' + m + ':' + s;
    }
    
    
    /* UI EVENT HANDLERS */
    
    $(document).on('click', '.queue-track:not(.queue-track-active)', function()
    {	
		startNewVideo(this);	
    });
    
    $(document).on('click', '.play-button', function()
    {
		if (player && player.getPlayerState() === YT.PlayerState.PLAYING) pause();
		else if (player && player.getPlayerState() === YT.PlayerState.PAUSED) play();
		else if ($('.queue-last-played').length)
		{
			var last = $('.queue-last-played').get(0);
			startNewVideo(last);
		}
		else
		{
			var first = $('.queue-track').first().get(0);
			if (first) startNewVideo(first);
		}
    });
    
    $(document).on('input', '.volume-slider', function()
    {
		updateVolume();

		var vol = $(this).val();
		if (vol === '0') 
		{ 
			var icon = $('.volume-icon');
			icon.removeClass('glyphicon-volume-up');
			icon.addClass('glyphicon-volume-off');
			$(this).one('input', function()
			{
				icon.addClass('glyphicon-volume-up');
				icon.removeClass('glyphicon-volume-off');
			});
		}
	    
    });
    
    $(document).on('change', '.seek-slider', function()
    {
		if (player)
		{
			seekTo(player.getDuration() * ($('.seek-slider').val() / 100));
		}	
    });
    
    $(document).on('click', '.play-prev', function()
    {
		// TODO button should be disabled if there is no previous	
		var prev = $(getLastPlayed()).prev().get(0);
		if (prev) startNewVideo(prev);
    });
    
    $(document).on('click', '.play-next', function()
    {
		playNext();
    });
    
    $(document).on('click', '.queue-remove-track', function(event)
    {
		event.stopPropagation();
		var d = $(this).closest('.queue-track').get(0);
		removeTrack(d);
    });
    
    $(document).on('change', '.shuffle-button', function()
    {
		if (!getShuffleStatus()) $('.queue-track').removeClass('shuffle-played');
		else $('.queue-track-active').addClass('shuffle-played');
    });
}