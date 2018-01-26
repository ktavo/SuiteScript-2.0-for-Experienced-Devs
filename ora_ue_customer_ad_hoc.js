/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.0
 */


require([
	'N/record',
	'N/email'
],
function(recordModule, emailModule) { 
		var customer = recordModule.load({
			type	: recordModule.Type.CUSTOMER,
			id		: 1673,
		});
		var customerId = customer.id;
		var customerName = customer.getValue('companyname');
		var customerEmail = customer.getValue('email');	
		var salesRep = recordModule.load({
			type	: recordModule.Type.EMPLOYEE,
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

});