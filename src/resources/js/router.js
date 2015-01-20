
var App = App || {instances: {}, classes: {}, config: {}};

App.classes.AppRouter = Backbone.Router.extend(
{
	routes:
	{
		'': 'search',
		'!/': 'search',
		'!/artist/:artist': 'artist',
		'!/artist/:artist/top-tracks': 'tracks',
		'!/artist/:artist/albums': 'albums',
		'!/artist/:artist/album/:album': 'album',
		'!/artist/:artist/track/:track': 'artist'
	},

	search: function()
	{
		this.switchView('.search-page-template', null, App.classes.SearchView);
	},

	artist: function(artistName)
	{
		var router = this;
		App.instances.api.getArtist(artistName).then(function(artist)
		{
			router.switchView('.artist-page-template', artist);
		});
	},

	tracks: function(artistName)
	{
		var router = this;
		App.instances.api.getArtist(artistName).then(getTracksFromArtist).then(function(tracks)
		{
			if (tracks.length) router.switchView('.tracks-page-template', tracks);
			else router.errorLoading('No albums found, whoops :(');
		});
		function getTracksFromArtist(artist) {return artist.getTracks();}
	},

	albums: function(artistName)
	{
		var router = this;
		App.instances.api.getArtist(artistName).then(getAlbumsFromArtist).then(makeViewFromAlbums);

		function getAlbumsFromArtist(artist) {return artist.getAlbums();}
		function makeViewFromAlbums(albums)
		{
			if (albums.length) router.switchView('.albums-page-template', albums);
			else router.errorLoading('No albums found, whoops :(');
		}
	},

	album: function(artistName, albumName)
	{
		var router = this;
		var artistP = App.instances.api.getArtist(artistName);
		var albumsP = artistP.then(getAlbumsFromArtist);
		var thisAlbumP = albumsP.then(searchForThisAlbum);
		var tracksP = thisAlbumP.then(getTracksFromAlbum);
		tracksP.then(makeViewFromTracks);

		function getAlbumsFromArtist(artist) {return artist.getAlbums();}
		function searchForThisAlbum(albums)
		{
			return _(albums).find(function(album)
			{
				return album.getName() === albumName;
			});
		}
		function getTracksFromAlbum(album)
		{
			return album.getTracks();
		}
		function makeViewFromTracks(tracks)
		{
			if (tracks.length) router.switchView('.album-page-template', tracks);
			else router.errorLoading('No tracks found on this album, whoops :(');
		}
	},

	/**
	 * Just a helper method to factor out the repetition.
	 *
	 * @param {string} templateSelector
	 * @param {Object} [data]
	 * @param {Backbone.View} [viewClass=App.classes.BaseView]
	 */
	switchView: function(templateSelector, data, viewClass)
	{
		if (!viewClass) viewClass = App.classes.BaseView;
		if (App.instances.currentView) App.instances.currentView.unRender(function()
		{
			App.instances.currentView = new viewClass(templateSelector, data);
		});
		else App.instances.currentView = new viewClass(templateSelector, data);
	},

	errorLoading: function(message)
	{
		App.instances.notif.new('error', message);
		Backbone.history.history.back(); // lol
	}
});