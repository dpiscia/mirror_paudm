#!/usr/bin/env python
'''
Created on Nov 8, 2012

@author: rodriguez
'''
import model

from pyramid.security import Allow, Authenticated

def groupfinder(userid, request): 
    '''Pyramids default authentication policies support a groupfinder 
    callback which, when passed the detected userid should return a list of 
    principals or None if the userid is invalid
    '''
    # extract all permissions from database
    request.user = request.db.query(model.User).filter_by(
        email = userid
    ).options(
        model.eagerload(model.User.groups)
    ).first()
    if request.user != None:
        permissions = ['group:%s' % g.name for g in request.user.groups]
        
        if (request.user.is_admin) : permissions.append("attr:admin")
        if (request.user.enabled)  : permissions.append("attr:enabled")
        
        return permissions

class RootFactory(object):
    '''RootFactory maps groups to permissions'''
    __acl__ = [
        (Allow, 'attr:enabled', 'view'),
        (Allow, 'attr:admin',  ('view',
                                'user.list')) #Allow view only to auth users
    ] #Access control list
    
    def __init__(self, request):
        self.request = request

        

	