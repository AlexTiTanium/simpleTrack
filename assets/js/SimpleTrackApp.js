/**
 * Created by Alex on 06.10.13.
 */
define(['Backbone'], function (backbone){

  var initialize = function (){
    console.log('start');
    $("#loading-mask").remove();
  };

  return { initialize: initialize }
});
