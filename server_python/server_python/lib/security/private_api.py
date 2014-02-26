import itertools
import hashlib
from server_python import model

def bit_map(array):
	'''from an order array, it returns the corresponding bit value ,0,1,2,4,8,16,..'''		
	return [{'name':j, 'bit':2**i} for i,j in enumerate(array)]
	
def combination(array):
	sub_groups = []
	for L in range(1, len(array)+1):
	  for subset in itertools.combinations(array, L):
	    sub_groups.append([i for i in subset])
	   
	print sub_groups
	return sub_groups
	

def generate_hash(element):
	return hashlib.md5(element).hexdigest()

def generate_name(array):
	'''given an order array, the function return the concatenation of element separeted by underscore'''
	return reduce(lambda x,y : x|y, array)

def get_password(array,connection,salt):
	'''to work it expects an array of group name ['des','euclid']'''
	#import pdb; pdb.set_trace()
	groups = connection.query(model.Group).filter(model.Group.name.in_(array)).order_by(model.Group.id).all()
	pwd = ""
	for group in groups:
		pwd = pwd+'group.password'
	return generate_hash(pwd)

	
	
getBin = lambda x: x >= 0 and str(bin(x))[2:] or "-" + str(bin(x))[3:]
	