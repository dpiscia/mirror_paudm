import jsondate as json
from cornice import Service
from .. import model
import yaml
from ..lib.helpers import _create_token, valid_token, _USERS

jobs_list = Service(name='jobs_list', path='api_python/jobs', description="get jobs list per user")

@jobs_list.get(validators=valid_token)
def jobs_list_get(request):
	user_id = request.validated['user_id']
	user   = request.db.query(model.User).filter_by(id = user_id).one()
	dict = []
	#import ipdb;ipdb.set_trace()
	for query in user.queries:
		dict.append({'id':query.id, 
						'status': query.status, 
						'Request date' : query.ts_created.strftime("%Y-%m-%d %H:%M:%S"), 
						'Delivery data' : query.ts_ended.strftime("%Y-%m-%d %H:%M:%S") if query.ts_ended else ""
						,'query' : yaml.safe_load(query.input)['sql']})
	request.stauts = 200
	return dict