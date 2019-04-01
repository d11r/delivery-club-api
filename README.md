### Delivery Club
This is an ongoing project for the Software Project course for 
Second Year Bachelor course on Innopolis University. 
If completed successfully, this app is aimed to be used at city of Innopolis 
to make the life of people in Innopolis easier, by making the delivery of food easier, secure, faster and reliable.

### Backend
This is a backend part of the project. 
You can find the frontend part <a href=https://github.com/strudra/delivery-club>here</a>. <br />
This backend provides all necessary services for adding, modifying and retrieving data.
It is built using <i>Node.js</i> with <i>Express framework</i>. It also uses <i>Atlas MongoDB</i> and <i>GraphQL</i> 
for storing and accessing data.

### Structure
```
/
├── config
│   ├── config.js
│   └── google-util.js
├── graphql
│   ├── resolvers
│   │   └── index.js
│   └── schema
│       └── index.js
├── helpers
│   └── producer-helper.js
├── middleware
│   └── is-auth.js
├── models
│   ├── category.js
│   ├── dish.js
│   ├── order.js
│   └── users
│       ├── consumer.js
│       └── producer.js
├── nodemon.json
├── package.json
├── public
│   └── index.html
├── src
│   ├── index.js
│   └── server.js
├── test
    └── user.test.js
```

# Developers
  ## Backend Developers  
  **Dragos Strugar, Peter Zaraharkin, Daniil Dvoryanov**   
  ## Frontend Developers 
  # Developers
  Ezio Thapaliya, Vladislav Smirnov
