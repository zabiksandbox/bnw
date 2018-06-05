jQuery(function($){
	$('.nav-item.dropdown').click(function(){
		if($(this).hasClass('hover')){
			return true;
		} else {
			$(this).addClass('hover');	
		}
		return false;
	});
});