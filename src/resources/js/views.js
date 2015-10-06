
/**
 * Base view useful for list-type pages
 *
 * @class
 */
App.classes.BaseView = Backbone.View.extend(
{
	elWrapper: '.content',
	//el: '.content', /* no good, it'll get removed by .remove */

	initialize: function(templateSelector, model, cb)
	{
		this.templateSelector = templateSelector;
		this.model = model;
		this.render(cb);
	},

	render: function(cb)
	{
		this.$el.appendTo($(this.elWrapper));
		var templateString = $(this.templateSelector).html();
		var templateStringWithData = this.model? _.template(templateString)(this.model) : templateString;
		this.$el.html(templateStringWithData);

		if ($('html').hasClass('unshown'))
		{
			// Webkit is too smart and won't show transitions for something
			// that was just added to dom and had its class immediately changed. Needs setTimeout
			// 0 works but this is future proof
			setTimeout(function()
			{
				$('html').removeClass('unshown');
				a();
			}, 1);
		}

		else a();

		function a()
		{
			var cl = this.$('.content-list');
			if (cl.length) cl.hide().show('drop', cb);
			else if (cb) cb();
		}
	},

	unRender: function(cb)
	{
		var view = this;
		var dropSpeed = 100;
		var list = view.$('.content-list');

		// If there's content, animate it out before replacing it
		if (list.length) list.hide('drop', dropSpeed, done);
		else done();

		function done()
		{
			view.$('.content').contents().empty();
			view.remove();
			if (cb) cb();
		}
	}
});

/**
 * More specialized view for the home page.
 *
 * @extends App.classes.BaseView
 * @class
 */
App.classes.SearchView = App.classes.BaseView.extend(
{
	events: {'keydown .search-query': 'key'},

	key: function(e)
	{
		if (e.which === 13) this.searchEnter();
		else if (e.which === 9)
		{
			e.preventDefault();
			this.tabSwitchSearchType();
		}
	},

	searchEnter: function()
	{
		var searchBox = this.$('.search-query');
		var query = searchBox.val().trim();
		if (!query) return;
		searchBox.blur();

		var type = this.$('.search-subject').data('searchType');

		if (type === 'artist')
		{
			// TODO error case
			App.instances.api.getArtist(query).then(function(artist)
			{
				App.instances.router.navigate('#!/artist/'+artist.getName(), {trigger: true});
			});
		}

		else if (type === 'song')
		{
			throw Error('Song search NYI');
		}

		else throw Error('The page type from "search" was no valid!');
	},

	tabSwitchSearchType: function()
	{
		Error('NYI'); // TODO implement tab
	},

	render: function(cb)
	{
		this.constructor.__super__.render.call(this, cb);
		$('.search-query').focus();
	}
});