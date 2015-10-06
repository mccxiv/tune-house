
/**
 * Represents an artist's album.
 *
 * @param {Object} structure Simple object with artist, name and image keys.
 * @constructor
 */
function Album(structure)
{
	if (!structure.artist || !structure.name) throw new Error('invalid parameters for Album');

	var artist = structure.artist;
	var name = structure.name;
	var image = structure.image;

	this.getArtist = function() {return artist;};
	this.getName = function() {return name;};
	this.getImage = function() {return image;};
	this.getTracks = function() {return App.instances.api.getAlbumTracks(this);};
}