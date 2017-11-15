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
    		
    		
    		var customer = context.newRecord;
    		var customerId = customer.id;
    		var customerName = customer.getText('companyname');
    		
    		var salesRep = recordModule.load({
    			type	: recordModule.Type.EMPLOYEE,
    			id		: customer.getValue('salesrep'),
    		});
    		salesRepName = salesRep.getText('entityid');
    		
    		
    		log.debug('Customer Id: ' , customerId);
    		log.debug('Customer name: ' , customerName);
    		log.debug('Sales representative Id: ' , salesRep.id);
    		log.debug('Sales representative name: ' , salesRepName);

    		
    		
    	}
    };
});
