Security postgres- server side:

create_security(session,groups_mapped,salt):
    session: sqlalchemy session
    groups_mapped: array of dictionary [{'name' :'group_name', 'bit' : bit position}]
    salt: salt unicode used in password creation

Based on all possible combination of groups, the application creates a set of postgres roles, whose name are build as 'User_10101',
where the bit combination is the bit operation of each group (previously mapped).
#Username
Ex.
DES: 1
EUCLID :2
PAU : 4

User(des,pau) ->001 | 100 -> 101 -> User_101

#PAssword
For each group the application creates  a password and this value is stored in DB.group.password field
The User_101 password wil be the hash of concatenation of password of DES and PAU

#Permission
each compound user, according to the groups ,will be granted permission through the standard postgres group role, "cat_des","cat_eiclid",etc.
