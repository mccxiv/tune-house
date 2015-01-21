# The tune house

## <a href="http://tunehouse.mccxiv.me" target="_blank">tunehouse.mccxiv.me</a>

A single page music player, Listen to any song or entire albums by searching for an artist.

#### Running the development version
- Clone this repository
- Copy ```config.sample.js``` as ```config.js``` and add your API keys to it

#### Creating a production version
- ```npm install``` to install gulp's dependencies
- ```gulp``` to concatenate and minify files
- check the ```compiled``` directory!


#### Features and status
- [x] Find songs and add them to a queue
- [x] Play songs in the queue
- [x] Share search results (deep links)
- [ ] Share a queue

##### Project info
- Last.fm and Youtube API mashup
- completely client side
- originally plain jQuery, now uses Backbone for the main content

##### Demo & live site: <a href="http://tunehouse.mccxiv.me" target="_blank">tunehouse.mccxiv.me</a>