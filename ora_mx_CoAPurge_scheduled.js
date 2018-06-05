/**
 * @NApiVersion 2.0
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/task', 'N/runtime'],
/**
 * @param {record} record
 * @param {search} search
 * @param {task} task
 */
function(record, search, task, runtime) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {
    	log.debug('*************', '************Called from suitelet***********');
        var accountsArray = loadAndRunCoASearch();
        deleteAccounts(accountsArray);          
    }
    
    function loadAndRunCoASearch() {
    	var accountArray = new Array();
    	log.debug('ora_mx_CoAPurgeScheduled.js', 'Running CoA search ....');
        var scheduledSearch = search.load({
            id: 'customsearch_mx_coa_purge'
        });
        var counter = 0;
        scheduledSearch.run().each(function(result) {
            //log.debug('Result: ', result);
            var accountId = result.id;
            accountArray.push(accountId);
            //log.debug('Search on entity', 'accountId: ' + accountId);            
            return true;
        });
        return accountArray;
	}
    
	function deleteAccounts(accountsList){
		log.debug('On delete accoutns call', 'Account list size: ' + accountsList.length);
        while (accountsList.length > 0)
        {
        	try
        	{
        		log.debug('On delete accoutns call', 'Inside while-try');
        		var remainingUsage = runtime.getCurrentScript().getRemainingUsage();
        		log.debug('Checking remaining ussage', 'Ussage left:' + remainingUsage); 
        		if(remainingUsage < 100 && remainingUsage > 85)
        		{
            		log.debug('Checking remaining ussage', 'Ussage left:' + remainingUsage); 
            		//callMyself(accountsList.length);
            		break;
        		}
        		else
        		{
            		log.debug('Tryinig to delete', 'Account ID:' + accountsList[0]); 
        			var deleteAccountRecord = record.delete({
                		type: record.Type.ACCOUNT,
                		id: accountsList[0],
                	});
            		log.debug('Account Deletion successful', 'Account ID:' + accountsList[0]); 
            		accountsList.shift();
        		}
        	}
        	catch(reason)
        	{
        		if (reason.name == 'SSS_USAGE_LIMIT_EXCEEDED')
        		{
            		log.error('Account can\'t be deleted', 'Account ID: ' + accountsList[0] + ' Reason:' + reason.name);
            		//callMyself(accountsList.length);
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
    }

    return {
        execute: execute
    };
    
});
