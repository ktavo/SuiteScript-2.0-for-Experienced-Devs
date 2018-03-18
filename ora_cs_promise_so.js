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
    	//createSearch can't be called if the savedSearch is already created
        //createSearch();
        var salesOrders = loadAndRunSearch();
        log.debug('salesOrder array: ', salesOrders);
        for (var i = 0; i < salesOrders.length; i++)
        {
        	//nonPromiseCall(salesOrders[i]);
            promiseCall(salesOrders[i]);
        }
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
	
    
    function loadAndRunSearch() {
    	var salesOrderArray = new Array();
    	log.debug('ora_cs_promise_so.js', 'Running search ....');
        var mySearch = search.load({
            id: 'customsearch_my_so_search'
        });
        var counter = 0;
        mySearch.run().each(function(result) {
            //log.debug('Result: ', result);
            var salesOrderId = result.id;
            salesOrderArray.push(salesOrderId);
            //log.debug('Search on entity', 'salesOrderId1: ' + salesOrderId);
        	/*
            var entity = result.getValue({
                name: 'entity'
            });
            var subsidiary = result.getValue({
                name: 'subsidiary'
            });
            */
        	counter++;
        	if (counter == 20)
        		{
        			return false;
        		}
            return true;
        });
        return salesOrderArray;
    }  
    
    
    function nonPromiseCall(salesOrderId){
    	var theSalesOrder = record.load({
    	    type: record.Type.SALES_ORDER, 
    	    id: salesOrderId,
    	    isDynamic: true,
    	});
    	var totalAmount = theSalesOrder.getValue('total');
    	log.debug('Synchronous Sales Order Total', 'Sales Order-' + salesOrderId + '- Total: ' + totalAmount);
    }
    
    
    function promiseCall(salesOrderId){
    	//log.debug('On Promise call', 'Sales Order-' + salesOrderId);
    	var theSalesOrder = record.load.promise({
    		type: record.Type.SALES_ORDER,
    		id: salesOrderId,
    	}).then(
    		//The salesOrder value is returned by record .load.promise 
    		function(salesOrder){
    			//Get total field and log that in the console
    			var totalAmount = salesOrder.getValue('total');
    	    	log.debug('Asynchronous Sales Order Total', 'Sales Order-' + salesOrderId + '- Total: ' + totalAmount);
    		}	
    	).catch(function onRejected(reason){
    		log.debug('Error loading sales order', '' + reason);
    	});    	
    }


    return {
        pageInit: pageInit     
    };
    
});
