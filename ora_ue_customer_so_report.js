/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([
	'N/task'
], function(task) {
     /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	var customer = scriptContext.newRecord;
    	var schedTask = task.create({
    		taskType : task.TaskType.SCHEDULED_SCRIPT
    	});
    	schedTask.scriptId = 'customscript_ora_ss_generate_so_report';
    	schedTask.deploymentId = 'customdeploy_ora_ss_generate_so_report';	
    	schedTask.params = {
    		custscript_ora_customer_id : customer.id
    	}
    	schedTask.submit();    	
    }
    return {
        afterSubmit: afterSubmit
    }; 
});
