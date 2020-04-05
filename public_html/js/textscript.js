/* So this is the javascript file and it is written using jquery.

Jquery is a javascript library that allows for selecting of HTML elements and performing really awesome things with them
It is very powerful. */

/*$ is the element selector, so this first one is used to select the entire form. e will be the event handler that we'll use*/
$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

      /*If the user starts typing in one of the labels, we will remove the highlight and add a blur. */
	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }

        /*If the label is currently blurred and the user removes all text from it and makes it empty again, we remove the blur */
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

/*Down here is for when the user clicks on the different tabs such as signup and login */

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  //this will be used to change the href to go to the different ID's such as #signup and #login
  target = $(this).attr('href');

  //if the current tab is not active, hide the entire div.
  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});