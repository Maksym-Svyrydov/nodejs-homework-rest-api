const app = require('./app');
const DB_HOST =
  'mongodb+srv://Maksym:assc2012@cluster0.xhngpck.mongodb.net/db-constacts?retryWrites=true&w=majority';
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running. Use our API on port: 3000');
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
