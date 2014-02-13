
import binascii
import os
from webob import Response, exc
import json

from server_python import model
_USERS = {}
class _401(exc.HTTPError):
    def __init__(self, msg='Unauthorized'):
        body = {'status': 401, 'message': msg}
        Response.__init__(self, json.dumps(body))
        self.status = 401
        self.content_type = 'application/json'
        
def _create_token():
    return binascii.b2a_hex(os.urandom(20))
    
    X-Messaging-Token
    
def valid_token(request):
	
	user_id = request.headers.get('user_id')
	if user_id is None:
		raise _401()

	request.validated['user_id'] = user_id