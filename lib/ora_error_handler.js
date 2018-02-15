define([],
function(){
	function customLog(e){
		log.error('Error Module', '-----There was an error handling the request-----');
		log.error('Error', e);
		var javascriptError = (e instanceof Error);
		if (javascriptError == true)
		{
			log.error('***JavaScript Error***', '***JavaScript Error***');
			log.error('Error name:', e.name);
			log.error('Error message:', e.message);
			log.error('Error stack:', e.stack);
			log.error('Error file name:', e.fileName);
			log.error('Error line number:', e.lineNumber);
		}
		else
		{
			log.error('***SuiteScript Error***', '***SuiteScript Error***');
			log.error('Error name:', e.name);
			log.error('Error message:', e.message);
			log.error('Error stack:', e.stack);
			log.error('Error id:', e.id);
			log.error('Error cause:', JSON.stringify(e.cause));
		}
	}
    return {
    	customLog : customLog    
    };
	    
});
