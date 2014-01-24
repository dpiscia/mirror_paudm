This the PAU data management web application, its functionalities are:

1-  Monitor jobs status (operation status and quality control status)
2-  Database schema exploration
3-  Dabase data exploration (Table and plot(scatter plot))
4- To be implemented (API brownthrower interaaction)

TO GET STARTED:

The backend services are implmented in Pyramid (Python, thread based application) 
and Express.js (Node.js, single process not blocking Input/Output application).

Prerequisites:

Python language >= 2.6
Node.js >= 0.8
git

1- Installation

```javascript
git clone git@gitlab01.pic.es:pau/paudm_web.git
cd paudm_web
```

1-A node.js server

´´´javascript
cd server_node
// install all npm packages defined in file packages.json
npm install