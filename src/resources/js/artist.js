
/**
 * Represents an artist.
 *
 * @param {Object} structure
 * @constructor
 */
function Artist(structure)
{
	if (!structure.name || !structure.image) throw new Error('invalid parameters for Artist');

	var name = structure.name;
	var image = structure.image;

	this.getName = function() {return name;};
	this.getImage = function() {return image;};
	this.getAlbums = function() {return App.instances.api.getAlbums(this);};
	this.getTracks = function () {return App.instances.api.getTracks(this);};
}