
/**
 * Describes which methods the music API wrapper should have.
 * @interface
 */
function MusicAPI() {}
MusicAPI.prototype.getArtist = function(artistName) {};
MusicAPI.prototype.getAlbums = function(artist) {};
MusicAPI.prototype.getTracks = function(artist) {};
MusicAPI.prototype.getAlbumTracks = function(album) {};


/**
 * Wrapper to abstract the actual API calls
 * so that they can be easily replaced in the future.
 *
 * @class
 * @implements MusicAPI
 * @param {Object} key
 */
function LastFMAPI(key)
{
	if (!key) throw Error('Last.fm API key was not provided');
	var lfm = new LastFM({apiKey: key});
	var spinner = App.instances.spinner;

	/**
	 * Gives an artist, using autocorrect.
	 * @param {string} artistName
	 * @return {Q.promise}
	 */
	this.getArtist = function(artistName)
	{
		var q = newPromise();

		lfm.artist.getInfo({artist: artistName, autocorrect: 1}, {error: q.reject, success: function(data)
		{
			var struct = {};
			struct.name = data.artist.name;
			struct.image = data.artist.image.pop()['#text'];
			q.resolve(new Artist(struct));
		}});
		return q.promise;
	};

	/**
	 * Gives an array of albums.
	 * @param {Artist} artist
	 * @return {Q.promise} An array of Album.
	 */
	this.getAlbums = function(artist)
	{
		var q = newPromise();
		lfm.artist.getTopAlbums({artist: artist.getName()}, {error: q.reject, success: function(data)
		{
			var albums = [];
			_(data.topalbums.album).each(function(thisAlbum)
			{
				var structure =	{};
				structure.artist = artist;
				structure.name = thisAlbum.name;
				structure.image = thisAlbum.image.pop()['#text'];
				albums.push(new Album(structure));
			});
			q.resolve(albums);
		}});
		return q.promise;
	};

	/**
	 * Gives a list of the top tracks by an artist.
	 * @param {Artist} artist
	 * @returns {Q.promise} Array of Track.
	 */
	this.getTracks = function(artist)
	{
		var q = newPromise();
		var data = {artist: artist.getName(), limit: 100};
		lfm.artist.getTopTracks(data, {error: q.reject, success: function(data)
		{
			// TODO what if it's only one?
			var tracks = [];
			_(data.toptracks.track).each(function(thisTrack)
			{
				tracks.push(new Track({artist: artist, name: thisTrack.name}));
			});
			q.resolve(tracks);
		}});
		return q.promise;
	};

	/**
	 * Gives you a list of tracks from the given album.
	 * @param {Album} album
	 * @returns {Q.promise} Array of Track.
	 */
	this.getAlbumTracks = function(album)
	{
		var q = newPromise();
		var artistName = album.getArtist().getName();
		var albumName = album.getName();
		var data = {artist: artistName, album: albumName};
		lfm.album.getInfo(data, {error: q.reject, success: function(data)
		{
			var tracks = [];
			var tracksArray = [];

			// When the album only contains one track, lastfm doesn't send back an array.
			if (Array.isArray(data.album.tracks.track)) tracksArray = data.album.tracks.track;
			else tracksArray.push(data.album.tracks.track);
			_(tracksArray).each(function(thisTrack)
			{
				var struct = {};
				struct.artist = album.getArtist();
				struct.album = album;
				struct.name = thisTrack.name;
				tracks.push(new Track(struct));
			});
			q.resolve(tracks);
		}});
		return q.promise;
	};

	/**
	 * Creates a new q promise and starts the ajax spinner.
	 * Ends the spinner it when this promise finishes.
	 *
	 * @returns {Q.defer} A new Q object
	 */
	function newPromise()
	{
		var q = Q.defer();
		spinner.start();
		q.promise.then(spinner.end);

		return q;
	}
}