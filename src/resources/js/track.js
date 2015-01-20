
/**
 * Represents a song.
 *
 * @param {Object} structure An object with the artist and name keys.
 * @constructor
 */
function Track(structure)
{
	if (!structure.artist || !structure.name) throw new Error('invalid parameters for Track');

	var artist = structure.artist;
	var name = structure.name;
	var album = structure.album; // may be undefined.

	this.getArtist = function() {return artist;};
	this.getAlbum = function() {return album;};
	this.getName = function() {return name;};
}