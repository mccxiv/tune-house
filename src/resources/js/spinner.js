
function Spinner()
{
	var count = 0;
	var active = false;
	
	this.start = function()
	{
		count++;
		checkSpinnerStatus();
	};
	
	this.end = function()
	{
		count--;
		checkSpinnerStatus();
	};
	
	function checkSpinnerStatus()
	{
		var newStatus;
		if (count > 0) newStatus = true;
		else newStatus = false;
		
		if (active !== newStatus)
		{
			active = newStatus;
			if (active) showSpinner();
			else hideSpinner();
		}
	}
	
	function showSpinner()
	{
		// TODO? maybe a better ajax indicator
		$('html').addClass('ajaxing');
	}
	
	function hideSpinner()
	{
		$('html').removeClass('ajaxing');
	}
}