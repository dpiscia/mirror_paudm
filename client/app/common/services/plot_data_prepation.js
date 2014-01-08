angular.module('plot_data_prepation',[]).factory('mod_chart_status', [ function(){
		return function(data_obj) 
		{
			//return data in json format and groupeb by status, ready to be fed into the d3 plots
			var hist = {};
			var data_tmp = [];
			for (var _i = 0,  _len = data_obj.length; _i < _len; _i++) {
				var i = data_obj[_i];
				if (hist[i.status]) hist[i.status] ++;
		  		else hist[i.status] = 1;}
		  	for (var property in hist){
				data_tmp.push({ status : property , data : hist[property]} );
				}
			return data_tmp;
		}	
	}])
	.factory('mod_chart_task', [ function(){
		return function (data_obj) 
		{
	//return data in json format and groupeb by status, ready to be fed into the d3 plots
			var hist = {};
			var data_tmp = [];
  
			for (var _i = 0, _len = data_obj.length; _i < _len; _i++) {
				var i = data_obj[_i];
				if (hist[i.task]) hist[i.task] ++;
				else hist[i.task] = 1;}
			for (var property in hist){
				data_tmp.push({ status : property , data : hist[property]} );
			}
		return data_tmp;
 		}
 	}])
.factory('mod_chart_qc', [ function(){
		return function (data_obj) 
		{
	//return data in json format and groupeb by quality_control value (true ,false and not available), ready to be fed into the d3 plots
			var hist = {};
			var data_tmp = [];
  
			for (var _i = 0, _len = data_obj.length; _i < _len; _i++) {
				if (data_obj[_i].qc == undefined) data_obj[_i].qc = 'N.A';
				var i = data_obj[_i];
				
				if (hist[i.qc]) hist[i.qc] ++;
				else 
					{
					hist[i.qc] = 1;}
				}
			for (var property in hist){
				data_tmp.push({ status : property , data : hist[property]} );
			}
		return data_tmp;
 		}
 	}])
.factory('mod_plot_status', [ function(){
	return function (data)
	{
	//return data in time series, grouped by status
	var entries = time(data);
	var entries_ord = entries.sort(dynamicSort("time"));
	return last(entries_ord,data);
	
	}

	function time(job_list){
		var prova = [];
		for (var i in job_list){
		//console.log(job_list[i].status);
		if (!!job_list[i].ts_created) {prova.push({"id" : job_list[i].id ,"status" : "CREATED", "time" : new Date(job_list[i].ts_created) }); }
		if (!!job_list[i].ts_queued) prova.push({"id" : job_list[i].id ,"status" : "QUEUED", "time" : new Date(job_list[i].ts_queued )});
		if (!!job_list[i].ts_started) prova.push({"id" : job_list[i].id ,"status" : "STARTED", "time" : new Date(job_list[i].ts_started )});
		if (!!job_list[i].ts_ended) prova.push({"id" : job_list[i].id ,"status" : "ENDED", "time" : new Date(job_list[i].ts_ended )});
		}
		return prova;
	}

	function dynamicSort(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1, property.length - 1);
	    }
	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    };
	}



	function last(event_list,job_list)
	{
		var fin = [];
		for (var i in event_list){
		    var done = 0;
		    var failed = 0;
		    var created = 0;
		    var queued = 0; 
		    var started = 0;
		    for (var j in job_list) {
		    //console.log(Date(job_list[j].ts_ended)  <= event_list[i].time);
		    	if ( new Date(job_list[j].ts_ended) <= event_list[i].time ) { 
					if (job_list[j].status == "DONE") {
					done++;
					}
					else {failed++;}
		     		}
		    	else if ( new Date(job_list[j].ts_started) <= event_list[i].time ) { 
					started++; }
		    	else if ( new Date(job_list[j].ts_queued) <= event_list[i].time ) { 
					queued++; }
		    	else if ( new Date(job_list[j].ts_created) <= event_list[i].time ) { 
					created++; }
		    }
			fin.push({"CREATED" : created, "QUEUED" : queued , "STARTED" : started , "FAILED" : failed , "DONE" : done, "date" : event_list[i].time});
		}
		return fin;
	}
}])
.factory('mod_plot_task', [ function(){
	return function mod_plot_task(data)
	{
		//return data in time series, grouped by task
	var entries = time_task(data);
	var entries_ord = entries[0].sort(dynamicSort("time"));
	return last_task(entries_ord,entries[1],data);
	
	}
	
	function dynamicSort(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1, property.length - 1);
	    }
	    return function (a,b) {
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    };
	}
	function time_task(job_list){
	var prova = [];
	var task_list = [];
	for (var i in job_list){
	//console.log(job_list[i].status);
	if (!(task_list.indexOf(job_list[i].task) > -1)){
		task_list.push(job_list[i].task);
	}

	if (!!job_list[i].ts_started) prova.push({"time" : new Date(job_list[i].ts_started )});
	if (!!job_list[i].ts_ended) prova.push({"time" : new Date(job_list[i].ts_ended )});
	}
	return [prova, task_list];
	}

	function last_task(event_list,task_list, job_list)
	{
		
		var fin = [];
		for (var i in event_list){
		    var counter =  new Array(null, (task_list.length)).map(Number.prototype.valueOf,0);
		    for (var j in job_list) {
		    if ( (new Date(job_list[j].ts_started) <= event_list[i].time) && (event_list[i].time < new Date(job_list[j].ts_ended))) { 
				counter[task_list.indexOf(job_list[j].task)]++;
			
		     }
	    }
	    var temp = {};
	    temp["date"]= event_list[i].time;
	    
		for (var k in task_list) 
		{
			temp[task_list[k]]= counter[k];	
		}
		fin.push(temp);
	}
	return fin;
	}
}])
.factory('tree_dict_from_flatten', [ function(){
		return function tree_dict_from_flatten(root_job, family, scope){
        
	        if (!family) family = [];
	        var structura = { "name" : "" , "status" : "" , "id" : "" , "size" : new Date(root_job.ts_ended)-new Date(root_job.ts_started) };
	        structura.name = root_job.task;
	        structura.status = root_job.status;
	        structura.id = root_job.id;
	        var subjobs = [];
	        for (var i=0; i<scope.length; i++)
	        {    
			if (scope[i].super_id == root_job.id) {subjobs.push(scope[i]);
	                                                   structura.children = [];  }
	        }  

        	family.push(structura);
        
        	for (var j=0; j<subjobs.length; j++)
            	tree_dict_from_flatten(subjobs[j], family[family.length-1].children, scope) ; 
			return family;
			}
     
    
}]).factory('group_status', [ function(){
		return function (data){
		var hist = [];
		data.map( function (a) { if (hist.indexOf(a.status) == -1 ) hist.push(a.status);  } );
		return hist;
     }
}]).factory('group_task', [ function(){  
        return function(data){
		var hist = [];
		data.map( function (a) { if (hist.indexOf(a.task) == -1 ) hist.push(a.task);  } );
		return hist;
     }
    
}]).factory('select_by_id', [ function(){  
        return function(data,id){
		
		for (var i=0; i<data.length; i++)
			{
			if (data[i].id === id) return data[i];
			}
		return null;
     }
    
}]);