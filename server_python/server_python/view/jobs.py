import jsondate as json
from cornice import Service
from .. import model
import yaml
from ..lib.helpers import _create_token, valid_token, _USERS

jobs_list = Service(name='jobs_list', path='api_python/jobs', description="get jobs list per user")
jobs_number = Service(name='jobs_conunter', path='api_python/jobs_counter', description="get jobs number") 

@jobs_list.get(validators=valid_token)
def jobs_list_get(request):
	user_id = request.validated['user_id']
	user   = request.db.query(model.User).filter_by(id = user_id).one()
	try:	
		dict = []
		#import ipdb;ipdb.set_trace()
		for query in user.queries:
			dict.append({'id':query.id, 
							'status': query.status, 
							'request_date' : query.ts_created.strftime("%Y-%m-%d %H:%M:%S"), 
							'delivery_date' : query.ts_ended.strftime("%Y-%m-%d %H:%M:%S") if query.ts_ended else ""
							,'query' : yaml.safe_load(query.input)['sql']
							,'download' : '/api_python/download_query/'+str(query.id),})
		request.stauts = 200
		return dict
	except Exception:

		error = 'Failed to retrieve data'
		request.response.status = 403
		return {'error' :error}	
	
@jobs_number.get(validators=valid_token)
def jobs_number_get(request):

	try:
		
		jobs_nbr = len(request.db.query(model.Query).all())
		request.stauts = 200
		return {'jobs_nbr' : jobs_nbr}
	except Exception:

		error = 'Failed to retrieve data'
		request.response.status = 403
		return {'error' :error}
		