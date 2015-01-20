
function Notifications()
{
    var ac = $('.alerts-container');
    
    // type: success, info, warning, danger
    this.new = function(type, text, duration)
    {
		duration = duration? duration: 2000;
		var alert = $('<div class="alert alert-'+type+'">'+text+'</div>');
		ac.append(alert);

		setTimeout(function()
		{
			alert.animate({'margin-right': '-400px', 'opacity': '0'}, 500, alert.remove);
		}, duration);
    };
}