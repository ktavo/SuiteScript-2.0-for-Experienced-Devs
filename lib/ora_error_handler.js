define([],
function(){
	function customLog(){
		log.error('Error Module', '-----There was an error handling the request-----');			
	}
    return {
    	customLog : customLog    
    };
	    
});
