/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

function(record, search) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
    	log.debug('On ora_cs_promise_so.js','');
    	nonPromiseCall(304);
    	//createSearch can't be called if the savedSearch is already created
        //createSearch();
        loadAndRunSearch();
    }
    
    
    function createSearch() {
    	log.debug('ora_cs_promise_so.js', 'Creating search ....');
        var mySalesOrderSearch = search.create({
            type: search.Type.SALES_ORDER,
            title: 'My SalesOrder Search',
            id: 'customsearch_my_so_search',
            columns: ['entity', 'subsidiary', 'name', 'currency'],
            filters: [
                ['mainline', 'is', 'T'],
                'and', ['subsidiary.name', 'contains', 'HEADQUARTERS']
            ]
        });
        mySalesOrderSearch.save();
    }
    //createSearch();
	
    
    function loadAndRunSearch() {
    	log.debug('ora_cs_promise_so.js', 'Running search ....');
        var mySearch = search.load({
            id: 'customsearch_my_so_search'
        });
        var counter = 0;
        mySearch.run().each(function(result) {
            //log.debug('Result: ', result);
            var salesOrderId = result.id;
            log.debug('Search on entity', 'salesOrderId1: ' + salesOrderId);
        	var entity = result.getValue({
                name: 'entity'
            });
            var subsidiary = result.getValue({
                name: 'subsidiary'
            });
        	counter++;
        	if (counter == 10)
        		{
        			return false;
        		}
            return true;
        });
    }
    //loadAndRunSearch();
    	
    
    
    
    
    /*function promiseCall(salesOrderId){
    	
    	
    }*/

   function nonPromiseCall(salesOrderId){
    	var theSalesOrder = record.load({
    	    type: record.Type.SALES_ORDER, 
    	    id: salesOrderId,
    	    isDynamic: true,
    	});
    	var totalAmount = theSalesOrder.getValue('total');
    	log.debug('Synchronous Sales Order Total', 'Sales Order-' + salesOrderId + '- Total: ' + totalAmount);
    }
    

    return {
        pageInit: pageInit     
    };
    
});
