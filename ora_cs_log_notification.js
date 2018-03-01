/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([
	'N/https', 
	'N/ui/dialog', 
	'N/url'
], function(https, dialog, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
    	if(scriptContext.mode == 'edit')
    	{
    		var expenseReport = scriptContext.currentRecord;
    		var transactionId = expenseReport.getValue('tranid');
    		
    		dialog.alert({
    			title:		'Edit log reminder', 
    			message:	'Please note that user information is log when an expense report is edited'
    		});
    		
    		var suiteletURL = url.resolveScript({
    			scriptId:			'customscript_sdr_sl_log_user',
    			deploymentId: 		'customdeploy_sdr_sl_log_user',
    			returnExternalUrl: 	false
    		});
    		
    		https.post({
    			url:	suiteletURL,
    			body:	{
    				sdr_tranid:	transactionId
    			}
    		});
    		
    	}

    }

    return {
        pageInit: pageInit
    };
    
});
