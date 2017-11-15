/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.0
 */


define([
	'N/record'
],

function(recordModule) {
   
    return {
    	afterSubmit: function (context) {
    		var employee = context.newRecord;
    		var supervisor = recordModule.load({
    			type 	: recordModule.Type.EMPLOYEE,
    			id 		: employee.getValue('supervisor')
    		});
    		log.debug('Employee Name: ', employee.getValue('entityid'));
    		log.debug('Supervisor ID: ', employee.getValue('supervisor'));
    		log.debug('Supervisor Name: ', employee.getText('supervisor'));
    		log.debug('Supervisor Email: ', supervisor.getValue('email'));
    	}
    };
});
