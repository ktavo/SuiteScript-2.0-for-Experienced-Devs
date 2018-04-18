/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/email', 'N/runtime'],
/**
 * @param {record} record
 * @param {search} search
 * @param {ui} ui
 * @param {email} email
 * @param {runtime} runtime
 */
function(record, search, ui, email, runtime) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
	function onRequest(context) {
        if (context.request.method === 'GET') {
            var form = ui.createForm({
                title: 'Suitelet Acount Purge'
            });
            form.addSubmitButton({
                label: 'Purge CoA'
            });
            context.response.writePage(form);
        } else {
            var request = context.request;
            var accountsArray = loadAndRunCoASearch();
            for (var i = 0; i < accountsArray.length; i++)
            {
                deleteAccounts(accountsArray[i]);
            }            
        }
    }
	
	
	function loadAndRunCoASearch() {
    	var accountArray = new Array();
    	log.debug('ora_mx_CoAPurge.js', 'Running CoA search ....');
        var mySearch = search.load({
            id: 'customsearch_mx_coa_purge'
        });
        var counter = 0;
        mySearch.run().each(function(result) {
            //log.debug('Result: ', result);
            var accountId = result.id;
            accountArray.push(accountId);
            //log.debug('Search on entity', 'accountId: ' + accountId);            
        	counter++;
        	if (counter == 5)
        	{
        		//return false;
        	}
            return true;
        });
        return accountArray;
	}
	   
	function deleteAccounts(accountId){
    	//log.debug('On delete accoutns call', 'Account:' + accountId);
    	try
    	{
    		var deleteAccountRecord = record.delete({
        		type: record.Type.ACCOUNT,
        		id: accountId,
        	});
    		log.debug('Account Deletion successful', 'Account ID:' + accountId);    		
    	}
    	catch(reason)
    	{
    		//log.debug('Account can\'t be deleted', 'Account ID: '+  accountId + ' Reason:' + reason);    			
    		try
    		{
    			record.submitFields({
        		    type: record.Type.ACCOUNT,
        		    id: accountId,
        		    values: {
        		    	isinactive: true
        		    },
        		    options: {
        		        ignoreMandatoryFields : true
        		    }
        		});    			
    		}
    		catch(reason)
    		{
        		log.error('Account can\'t be deleted or deactivated', 'Account ID: ' + accountId + ' Reason:' + reason);    			    			
    		}    		
    	}
    }	
	
    return {
        onRequest: onRequest
    };
});