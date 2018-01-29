/**
 * 
 */
define([
   'N/render',
   'N/file',
   'N/email'
], function(render, file, email) {
	
   function processTemplateData(orderSearch) {
      var orders = [];
      var customerName;
      orderSearch.run().each(function(result) {
         customerName = result.getText('entity');
         orders.push({
            trandate : result.getValue('trandate'),
            tranid   : result.getValue('tranid'),
            salesrep : result.getText('salesrep'),
            total    : result.getValue('total')
         })
         return true;
      });

      return {
         customerName : customerName,
         orders       : orders
      }
   }

   function generateReport(templateData) {
      var reportTemplate = file.load({
         id : 'SuiteScripts - Globals/html/so_report_template.htm'
      }).getContents();

      var renderer = render.create();
      renderer.templateContent = reportTemplate;
      renderer.addCustomDataSource({
         format : render.DataSource.OBJECT,
         alias  : 'orderData',
         data   : templateData
      });

      return renderer.renderAsPdf();
   }
   
   function sendEmail(attachment) {
      email.send({
         author     : -5, // TODO: Replace a more dynamic sender/recipient
         recipients : -5,
         subject    : 'Sales Order Report',
         body       : 'Sales Order Report',
         attachments : [attachment]
      });
   }

   return {
      sendReport : function (orderSearch) {
         var templateData = processTemplateData(orderSearch);
         var soReport = generateReport(templateData);
         sendEmail(soReport);
      }
   };
});
