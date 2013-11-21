/* jshint -W009 */
/* jshint -W117 */
/*db.client_job('job as p').
		join('dependency','p.id', '=' ,'dependency.child_job_id', 'left')
		.select(db.client_job.raw('*, (select count(*)  from job a where a.super_id = p.id) as nbr'))
		.whereNull('p.super_id').then
		*/

var async = require('async');
var q = require('q');
var db = require('../db');

module.exports.recursive_query =  function(id,level) {//Postgresql recursive query, much faster than function flat_tree_dict
	return (/*jshint multistr: true */"with recursive t(level,nbr, dep, super_id,id, task, status, config, input, output , ts_created, ts_started, ts_ended) as ( \
		select 0, (select count(*) as nbr from job a where a.super_id = p.id),  array (select parent_job_id from dependency where child_job_id = p.id) , \
		super_id,id, task, status, config, input, output , ts_created, ts_started, ts_ended from job p where p.id = "+id+" \
		union \
		select \
		level + 1, \
		(select count(*) as nbr from job a where a.super_id = p.id), \
			array (select parent_job_id from dependency where child_job_id = p.id), \
			p.super_id, \
			p.id, \
			p.task, p.status, \
			p.config, \
			p.input, p.output, p.ts_created, p.ts_started, p.ts_ended	from \
			job p join t \
			on p.super_id = t.id  where level<"+level+"\
) select * from t   ;");	
};
/*jshint unused:true*/

module.exports.flat_tree_dict = function(root_job,level, level_set, callback) //sqlite recursive query
{
	var treeSet = []; 
	db.client_job('job as p').select(db.client_job.raw('*, (select count(*) from job a where a.super_id = p.id) as nbr')).where('id',root_job).then
	(
		function(resp) 
		{
			treeSet.push(resp[0]); 
		}, 
		function(err) 
		{
			console.log(err.message);
		}
	); 
    ++level;
	db.client_job('job').where("super_id",root_job).select().then
			( 
				function(resp) 
				{
					function each(row, next) 
					{
						if (level <= level_set){
							flat_tree_dict(row.id, level, level_set, function (subSet) {
							treeSet = treeSet.concat(subSet);
							next(null);
							});
						}
						else {next(null);}
					}
					function done() {
						callback(treeSet);
					}
					async.forEachSeries(resp, each, done);
				}, 
				function(err) 
				{
					console.log(err.message);
				}
			);	

};

module.exports.quality_control = function(resp) //get the general quality control value attached to a job list
			{	var deferred = q.defer();
				var job_ids = new Array();
				var ids = {};
				for (var i in resp) {
					
					job_ids.push(resp[i].id);				
					ids[resp[i].id] = i;}
					//select informative quality control and attach them to job informations
				db.client_pau("quality_control").select().whereIn('job_id',job_ids).andWhere('ref','general').then
								(
					function(resp_qc) 
					{
						
						
						for (var i in resp_qc) {
							resp[ids[resp_qc[i].job_id]].qc = resp_qc[i].qc_pass;
							}	
					
						deferred.resolve(resp);
					}, 
					function(err) 
					{
						console.log(err.message);
					}
				);  
			return deferred.promise;	
			};