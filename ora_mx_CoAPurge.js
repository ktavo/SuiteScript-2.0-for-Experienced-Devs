/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/email', 'N/runtime', 'N/redirect'],
/**
 * @param {record} record
 * @param {search} search
 * @param {ui} ui
 * @param {email} email
 * @param {runtime} runtime
 */
function(record, search, ui, email, runtime, redirect) {
   
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
            deleteAccounts(accountsArray);          
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
	   
	function deleteAccounts(accountsList){
    	log.debug('On delete accoutns call', 'Account list size:' + accountsList.length);
		//return 0;
		
		var parentAccounts = new Array();
        while (accountsList.length > 0)
        {
        	try
        	{
        		var deleteAccountRecord = record.delete({
            		type: record.Type.ACCOUNT,
            		id: accountsList[0],
            	});
        		log.debug('Account Deletion successful', 'Account ID:' + accountsList[0]); 
        		accountsList.shift();
        	}
        	catch(reason)
        	{
        		log.error('Account can\'t be deleted', 'Account ID: '+  accountsList[0] + ' Reason:' + reason.name);
        		if (reason.name == 'THIS_RECORD_CANNOT_BE_DELETED_BECAUSE_IT_HAS_DEPENDENT_RECORDS')
        		{
        			accountsList.push(accountsList.shift());        			
        		}
        		else
        		{
        			try
            		{
            			record.submitFields({
                		    type: record.Type.ACCOUNT,
                		    id: accountsList[0],
                		    values: {
                		    	isinactive: true
                		    },
                		    options: {
                		        ignoreMandatoryFields : true
                		    }
                		});
                		accountsList.shift();
            		}
            		catch(reason)
            		{
                		log.error('Account can\'t be deleted or deactivated', 'Account ID: ' + accountsList[0] + ' Reason:' + reason.name);
                		accountsList.shift();
            		}    			
        		}
        	}
        }
        redirect.toSuitelet({
            scriptId: 257,
            deploymentId: 1,
            parameters: {'':''} 
        });
    }
    return {
        onRequest: onRequest
    };
});







