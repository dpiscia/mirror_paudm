def create_psql_user_psw(user,password,groups,connection):
	try:	
		connection.execute("CREATE USER %s WITH password '%s'" % (user,password))
		
		for group in groups:
			connection.execute("GRANT %s to %s" % (group, user))
			print "GRANT %s to %s" % (group, user)
		connection.commit()
		print "CREATE USER %s WITH password '%s'  " % (user,password)
	except:
		connection.rollback()
		raise
		
def grant_permissions_to_table(group,table,connection):
	try:
		connection.execute("GRANT SELECT ON %s TO %s" % (table, group))
		connection.commit()
		print "GRANT SELECT ON %s TO %s" % (table, group)
	except:	
		connection.rollback()
		raise
		
def revoke_permissions_from_table(group,table,connection):
	try:
		connection.execute("REVOKE SELECT ON %s FROM %s" % (table, group))
		connection.commit()
		print "REVOKE SELECT ON %s FROM %s" % (table, group)
	except:	
		connection.rollback()
		raise	
		
def delete_user(user,connection):
		try:
			connection.execute("DROP ROLE %s" %(user))
			connection.commit()
			print "DROP ROLE %s" %(user)
		except:	
			connection.rollback()
			raise	