from server_python.lib.security.api import remove_all_user,remove_group_pwd_roles,create_group_pwd_roles,create_all_user,create_session, get_group_mapped 

def create_security(session,groups_mapped,salt):
	'''create all security infrastructure
	1- create standard roles :DES,EUCLID,..
	2- create combination roles, User_101
	3- GRANT combination roles select to corresponding groups'''
	
	create_group_pwd_roles(groups_mapped,session,salt)
	#grant_all_tables(groups_mapped,session)
	create_all_user(groups_mapped,session,salt)
	



def remove_security(session,groups_mapped):
	'''remove all security infrastructure
	1- remove standard roles :DES,EUCLID,..
	2- remove combination roles, User_101
	3- REVOKE combination roles select to corresponding groups'''	
	#revoke_all_tables(groups_mapped,session)
	remove_group_pwd_roles(groups_mapped,session)	
	remove_all_user(groups_mapped,session)
	


if __name__ == "__main__":
	session = create_session('postgresql://')
	groups_mapped = get_group_mapped(session)
	create_security(session,groups_mapped,'prova')
	#remove_security(session,groups_mapped)