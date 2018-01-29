/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define([
	'N/runtime', 
	'N/search'
],
	
/**
 * @param {runtime} runtime
 * @param {search} search
 */
function(runtimeModule, searchModule) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {

    }

    return {
        execute: execute
    };
    
});
