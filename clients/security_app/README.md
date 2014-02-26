Security on the client side is made of the follwoing points:

in app/common/services/user_auth there are the foundamentals operations:
    - log in
    - log out
    - register
    - islogged
    - isauthorized

Each view in the apps is linked to access level (anomymous, user, admin) , based on this value and the user 
corresponding value, the app.js (at the beginning of app) decides if the user is authorized to enter that view.

Every time the client requests some data to the server , it has to send the piar, (name,api_key) previously assigned bu the serv upon succesfull login.

Server side:
on login, the server creates a pair of value, name and api_key.
On each client requests, it validates this pair against the in memory values (eventually replaced by a key-value db as REDIS)