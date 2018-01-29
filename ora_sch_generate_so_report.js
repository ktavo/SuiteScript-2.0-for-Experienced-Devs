/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define([
	'N/runtime', 
	'N/search',
	'/SuiteScripts - Globals/lib/sdr_lib'
], function(runtime, search, sdrLib){
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) 
    {
    	var scriptRef = runtime.getCurrentScript();
    	var customerId = scriptRef.getParameter({
    		name : 'custscript_ora_customer_id'
    	});
    	var orderSearch = search.create({
    		type : 'transaction',
    		filters : [
    			['type', 'anyof', 'SalesOrd'], 'and',
    			['mainline', 'is', true]			
    		],
    		columns : ['entity', 'trandate', 'tranid', 'salesrep', 'total']
    	});
    	sdrLib.sendReport(orderSearch);
    }
    return  {
        execute: execute
    };
});
