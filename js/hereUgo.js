/*
 * 	hereUgo 1.0 - jQuery plugin
 *	written by Joey Navarro	
 *	http://www.joeynavarro.com
 *
 *	Copyright (c) 2013 Joey Navarro (http://www.joeynavarro.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function($) {
		

/*------------------------
Listen For Click
-------------------------*/

$(document).on('click', '[data-display]', function(e){
	e.preventDefault();
	var hereUgoID = $(this).attr('data-display');
	$('#'+hereUgoID).display($(this).data());	

});

/*------------------------
Set Defaults
-------------------------*/

	$.fn.display = function(options) {
	
		var defaults = {
			//Set default animation, can be set to any jQuery UI effect
			//blind, bounce, clip, drop, explode, fade, fold, hilight, puff, pulsate, scale, shake, size, slide, transfer
			animation: 'fade', 
			
			//Set the speed of the animation				   
			animationspeed: 200, 
			
			//click background to close box yea or nay
			bgclose: true,
		};
		
		options = $.extend({}, defaults, options); 
		

		
		return this.each(function() {
			
/*------------------------
Globals Are Nice
-------------------------*/	
			
			var hereUgo = $(this),
				locked = false,
				hereUgoBG = $('.hereUgo-overlay'),
				scrollBar;
				
/*--------------------------
IE Check
---------------------------*/

			var mobileIE = false
			
			if(navigator.userAgent.match(/Windows Phone/i)){
				mobileIE = true;	
			}

/*---------------------------
Animations Locks
----------------------------*/
	
			function unlockHUG() { 
				locked = false;
			}
			function lockHUG() {
				locked = true;
			}			
/*------------------------
Drop in da BG
-------------------------*/
			
			//If hereUgo background does not exist add it after hereUgo
			if(hereUgoBG.length == 0) {
				hereUgoBG = $('<div class="hereUgo-overlay" />').insertAfter(hereUgo);
			}

/*-------------------------
Scroll Bar and Close Button
--------------------------*/   
       
        	//If slimScroll function exists scrollBar equals TRUE
			//Else scrollBar equals FALSE
			if (typeof $.fn.slimScroll == 'function'){
				scrollBar = true;
			}else{
				scrollBar = false;	
			};

			//IF hereUgo does not have a scroll bar div  and scrollBar is set to TRUE
			if (hereUgo.has(".scrollBar").length == 0 && scrollBar == true){
				
				//Wrap Everything in the hereUgo div in a new div with class of scrollBar
				//Add 20 padding on right and set hereUgo padding to 10 to offset inclusion of scroll bar
				hereUgo.wrapInner('<div class="scrollBar" style="padding-right:20px;" />'),
				hereUgo.css({'padding-right' : 10});
				
				//Run the slimScroll function
				$(function(){
					$('.scrollBar').slimScroll({
						height: '100%'
					});
				});	
				
				//Add Close button anchor tag last so it's not traped in slimScroll div
				hereUgo.append('<a class="close-hereUgo">&#215;</a>');		
			}
			
			//If no Close button exists add one
			if (hereUgo.has(".close-hereUgo").length == 0 && scrollBar == false){
				
				hereUgo.append('<a class="close-hereUgo">&#215;</a>');
			}
			
/*------------------------
Keep It In Da Center
-------------------------*/	
			
			hereUgo.center = function () {
			var top, left;
			
				//If window width is greater than or equal to 1025px 
				//OR box height	is greater than window height 
				//AND scrollBar is TRUE set height to 90%
				 if(hereUgo.outerHeight() + 25 > $(window).height() && scrollBar === true && mobileIE === false){
					 
					 var maxH = $(window).height() - 80;
					 
					hereUgo.css({'height' :maxH + 'px'});	 
				}
				
				//Set top an left to 0 <-- seems unnecessary but fixed window offsetting problems when box first appears
				hereUgo.css({
					top:0, 
					left:0
				});
			
				//Get the windows height minus the hereUgo height divide it in half
				//Get the windows width minus the hereUgo width divide it in half
				
				top = Math.max($(window).height() - hereUgo.outerHeight(), 0) / 2;
				left = Math.max($(window).width() - hereUgo.outerWidth(), 0) / 2;
				
				//Set top and left values for hereUgo to center it 
				
				hereUgo.css({
					top:top + $(window).scrollTop(), 
					left:left + $(window).scrollLeft()
				});
				// If window width greater than or equal to hereUgo width move close icon inside box 
				//and leave 5px margin on either side of box
				
				if(hereUgo.innerWidth() + 10 >= $(window).width()){
					hereUgo.css({'margin-right' : 5 + 'px'}),
					$('.close-hereUgo').css({'top': 3, 'right': 3});
					
				// Else no margin and position close icon upper right hanging off corner		
				}else{
					hereUgo.css({'margin-right' : 0 + 'px'}),
					$('.close-hereUgo').css({'top': -6, 'right': -7});	
				}
				
				//If hereUgo height is greater than or equal to window height add top of 20 
				if(hereUgo.outerHeight() >= $(window).height() && scrollBar == false){
					hereUgo.css({'top' : 20 + $(window).scrollTop()});
				}

			};
			
			//Run the center function
			hereUgo.center();	
			
			//Run it again as window is resized
			$(window).on('resize.hereUgo', hereUgo.center);
			
/*------------------------
Make It Appear 
-------------------------*/ 
			
			//When the hereUgo opens
			hereUgo.on('hereUgo:open', function () {
				
				//If its not locked
				if(!locked) {
					
					//lock It
					lockHUG();
					
					//If no animation is set
					if(options.animation == '') {
						
						//Set hereUgo and background to display block so they just appear 
						hereUgo.css({'display' : 'block'}),
						hereUgoBG.css({'display':'block'});	
						
						//Then unlock the hereUgo
						unlockHUG();				
					}else{
						
						//Else fade in the BG and run animation on hereUgo
						hereUgoBG.fadeIn(options.animationspeed);
						hereUgo.show(options.animation, options.animationspeed);
						
						//Then unlock hereUgo
						unlockHUG();																				
					}
				}
			});
				
/*------------------------
Make It Go Away
-------------------------*/	
			
			//When hereUgo is closed
			hereUgo.on('hereUgo:close', function () {
				
				//If its not locked
				if(!locked) {
					
					//lock It
					lockHUG();
					
					//If no animation is set
					if(options.animation == '') {
						
						//Set hereUgo and background back to display none  
						hereUgo.css({'display' : 'none'}),
						hereUgoBG.css({'display' : 'none'});
						
						//Then unlock hereUgo
						unlockHUG();	
					}else{
						
						//Else fade out the BG and hereUgo
						hereUgoBG.fadeOut(options.animationspeed),
						hereUgo.fadeOut(options.animationspeed);
						
						//Then unlock hereUgo
						unlockHUG();				
					} 
					
					//On close turn off the resize handler 
					//triggering the hereUgo.center function  		
					$(window).off('resize.hereUgo');	
				}}
			);     

/*-------------------------------
Open and Closing Listeners
--------------------------------*/
			
			//Open 
			hereUgo.trigger('hereUgo:open')
			
			//Close
			//Close Button
			var closeButton = $('.close-hereUgo').one('click.hereUgoEvent', function () {
				hereUgo.trigger('hereUgo:close')
			});
			//Background Click
			if(options.bgclose) {
				hereUgoBG.css({'cursor':'pointer'})
				hereUgoBG.one('click.hereUgoEvent', function () {
				hereUgo.trigger('hereUgo:close')
				});
			}
			//Escape Key
			$('body').keyup(function(e) {
				if(e.which===27){ hereUgo.trigger('hereUgo:close'); }
			});			
		
		});//end return each function 
	}//end display function
})(jQuery);
