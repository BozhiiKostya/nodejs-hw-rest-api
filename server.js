const mongoose = require('mongoose');
const app = require('./app');

const DB_HOST =
  'mongodb+srv://Kostya:E79dnurTjSCemjZU@cluster0.xlmk18w.mongodb.net/db_contacts?retryWrites=true&w=majority';

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful');
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
