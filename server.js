const express = require('express');
const sequelize = require('./config/connection');
const routes = require('./routes');
sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  console.log('All models were synchronized successfully.');
  // Start the server
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
}).catch((err) => {
  console.error('An error occurred while synchronizing the models:', err);
});
