/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/runtime', 'N/redirect', 'N/task'],
/**
 * @param {record} record
 * @param {search} search
 * @param {ui} ui
 * @param {email} email
 * @param {runtime} runtime
 */
function(record, search, ui, runtime, redirect, task) {
   
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
        	log.debug('*************', '************On POST Call***********');
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
		log.debug('On delete accounts call', 'Account list size: ' + accountsList.length);
        while (accountsList.length > 0)
        {
        	if (accountsList[0] == '10991' )
        	{
        		continue;
        		
        	}
        	try
        	{
        		var remainingUsage = runtime.getCurrentScript().getRemainingUsage();
        		if(remainingUsage < 200)
        		{
            		log.debug('Checking remaining ussage', 'Ussage left:' + remainingUsage); 
            		callScheduledScript(accountsList.length);
            		accountsList = [];
            		break;
        		}
        		else
        		{
        			var deleteAccountRecord = record.delete({
                		type: record.Type.ACCOUNT,
                		id: accountsList[0],
                	});
            		//log.debug('Account Deletion successful', 'Account ID:' + accountsList[0]); 
            		accountsList.shift();
        		}
        	}
        	catch(reason)
        	{
        		if (reason.name == 'SSS_USAGE_LIMIT_EXCEEDED')
        		{
            		log.error('Account can\'t be deleted', 'Account ID: ' + accountsList[0] + ' Reason:' + reason.name);
            		//callScheduledScript(accountsList.length);
            		break;
        		}
        		else if (reason.name == 'THIS_RECORD_CANNOT_BE_DELETED_BECAUSE_IT_HAS_DEPENDENT_RECORDS')
        		{
            		log.error('Account can\'t be deleted', 'Account ID: '+  accountsList[0] + ' Reason:' + reason.name);
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
                		if (reason.name == 'SSS_MISSING_REQD_ARGUMENT')
                		{
                			accountsList = new Array();
                		}
                		else
                		{
                			accountsList.shift();                			
                		}
            		}    			
        		}
        	}
        }
        redirect.toSuitelet({
            scriptId: 257,
            deploymentId: 489,
            parameters: {'':''} 
        });
    }
	
	function callScheduledScript(accountsLeft)
	{
    	log.debug('Calling sheduled script', 'Account list size:' + accountsLeft);    	
    	var scriptTask = task.create({taskType: task.TaskType.SCHEDULED_SCRIPT});
    	scriptTask.scriptId = 259;	
    	scriptTask.deploymentId = 'customdeploy_ora_mx_coapurge_scheduled';
    	//scriptTask.params = {searchId: 'custsearch_456'};
    	var scriptTaskId = scriptTask.submit();		
	}
	
    return {
        onRequest: onRequest
    };
});







