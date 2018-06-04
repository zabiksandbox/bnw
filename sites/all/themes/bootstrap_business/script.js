jQuery(function () {
  //jQuery('[data-toggle="tooltip"]').tooltip({'html':true, 'title':jQuery('.tooltipshow.tooltip-'+jQuery(this).data('id')).html()});
  jQuery('[data-toggle="tooltip"]').hover(function(){
  	//console.log(jQuery('.tooltipshow.tooltip-'+jQuery(this).data('id')).html()); 
  	//return jQuery('.tooltipshow.tooltip-'+jQuery(this).data('id')).html();
  	//}
  });
  

})

jQuery(document).ready(function () {
	jQuery('#header').css({'height':(jQuery(window).width()-23)/4.329});
   jQuery(window).scroll(function(){
  			console.log(jQuery(window).scrollTop());
  			var offset=(jQuery(window).scrollTop())/1;
  			var koef=(jQuery(window).height()/offset);
  			
  			//if(offset>280) offset=280;
  			if(koef<2){
				offset=(jQuery(window).height()/2)
			}
  			console.log(jQuery(window).height() + ' / '+ offset + ' = ' + (jQuery(window).height()/offset));
  			
  			
  			jQuery('.headbgv').css({
  				"transform": "translate3d(0px, -" + offset + "px, 0px)"
  			})
  			jQuery('#logo').css({
  				"transform": "translate3d(0px, " + offset/2 + "px, 0px)"
  			})
  		});
})