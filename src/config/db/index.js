// function to connect to mongodb
const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb+srv://truongtoan:QufXK8RfPo9qDiFH@clustermaster.kxfcy.mongodb.net/english_app_dev?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
  } catch (error) {
    console.log('Connect failure to database!!!');
  }
  
}

module.exports = {connect};
