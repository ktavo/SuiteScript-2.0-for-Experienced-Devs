/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.0
 */


define([
	'N/record',
	'N/email',
	'/SuiteScripts/ora_error_handler.js'
],
function(recordModule, emailModule, errorHandler) { 
    return {
    	afterSubmit: function (context) { 	
    		log.debug('context type: ' , context.type);
    		errorHandler.customLog();
    		if (context.type == 'edit')
    		{
    			var customer = context.newRecord;
        		var customerId = customer.id;
        		var customerName = customer.getValue('companyname');
        		var customerEmail = customer.getValue('email');	
        		try
        		{
        			//Javascript Error
        			//customerEmail = bla;
        			var salesRep = recordModule.load({
            			type	: recordModule.Type.EMPLOYEE,
            			//Netsuite error comment 'id : customer.getValue('salesrep'),'
            			//id		: 777,
            			id		: customer.getValue('salesrep'),
            		});
            		salesRepName = salesRep.getText('entityid');
            		salesRepNotes = salesRep.getValue('comments'); 		
            		log.debug('Customer Id: ' , customerId);
            		log.debug('Customer name: ' , customerName);
            		log.debug('Customer email: ' , customerEmail);
            		log.debug('Sales representative Id: ' , salesRep.id);
            		log.debug('Sales representative name: ' , salesRepName);
            		log.debug('Sales representative comments: ' , salesRepNotes);
            		emailModule.send({
            			author 			: salesRep.id,
            			recipients 		: customerEmail,
            			cc				: ['griospaez@netsuite.com'],
            			subject 		: 'welcome to SuiteDreams',
            			body 			: 'Welcome we\'re glad you are a customer of suitedreams.',
            		});
            		salesRep.setValue('comments', salesRepNotes + '\nNew welcome email sent to ' + customerName);
            		salesRep.save();	
        		}
        		catch(e)
        		{
        			log.error('Error', '-----There was an error handling the request-----');
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
    		}
    		else
    		{
        		log.error('Error', 'Wrong context');
    		}
    	}
    };
});