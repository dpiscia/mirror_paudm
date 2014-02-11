'use strict';
/* jshint -W117 */
/* jshint -W065 */
/* Filters */

angular.module('paudm.filters', []).filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [];
      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
})
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
}).
filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      {input.push(i);}
    return input;
  };
}).filter('nl2p', function () {
    return function(text){
        text = String(text).trim();
        text = text.replace(/\n|\r/g, '</p><p>');
        return (text.length > 0 ? '<p>' + text.replace(/\s/g, '&nbsp;') + '</p>' : null);
    };
}).filter('job_check', function () {
    return function(arrays,filters){
    var arrayToReturn = []; 
    var prod_filter = false;
    var task_filter = false;
    var status_filter = false;
    var check_parent = function() {   
            		for (var j=0; j<arrays[i].dep.length; j++)
            			{
						if (arrays[i].id === parseInt(filters[0]) || arrays[i].dep[j] === parseInt(filters[0]) ) return true;
						}
						return false;
				}
    if (!(filters[0] === undefined  || filters[0] === "!!")) prod_filter = true;
    if (!(filters[1] === undefined  || filters[1] === "!!")) task_filter = true;
    if (!(filters[2] === undefined  || filters[2] === "!!")) status_filter = true;
    
    if (!(prod_filter) && !(task_filter) && !(status_filter)) {
        return arrays; }
        else
        {
        for (var i=0; i<arrays.length; i++){
            
            if ( (check_parent()  || !(prod_filter) ) && 
            	(arrays[i].task === filters[1] || !(task_filter) )  &&
            	(arrays[i].status === filters[2] || !(status_filter) ) ) {
                arrayToReturn.push(arrays[i]);
                
            }
            
        }
        return arrayToReturn;}
        
    };
});