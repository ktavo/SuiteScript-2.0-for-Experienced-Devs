/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/record', 'N/ui/message'],
/**
 * @param {runtime} runtime
 */
function(runtime, record, ui_message) {

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
    	var scriptObject = runtime.getCurrentScript();
    	var scriptParameter = scriptObject.getParameter('custscript_ora_display_notification');
    	//log.debug('scriptContext', scriptContext);
    	if (scriptParameter == true)
    	{
    		var currentRecord = scriptContext.currentRecord;
    		var customerName = currentRecord.getValue('entityid');
        	//log.debug('currentRecord', currentRecord);
        	//log.debug('customerName', customerName);
    		//var reminder = confirm('Please call ' + customerName + ' to welcome them as a new customer before saving the record. Click cancel to go back to the record');		
        	//return reminder;
    		var vendorMessage = ui_message.create({
    			title: "Customer contact reminder", 
				message: 'Please call ' + customerName + ' to welcome them as a new customer before saving the record', 
			    type: ui_message.Type.WARNING
    		});
    		//vendorMessage will disappear after 5s    		
			var messagePromise = new Promise(function(resolve, reject) {
    			vendorMessage.show();
    			resolve(setTimeout(function(){vendorMessage.hide();alert('Verify alert message');}, 1500));
    		});
			return messagePromise.then(function() { 
				return true; 
			});
    	}    	
    	else
    	{
        	log.debug('scriptParameter', 'Disabled');
        	return true;
    	}
    }

    return {
        saveRecord: saveRecord
    };
    
});
