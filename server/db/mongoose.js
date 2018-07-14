const mongoose = require('mongoose');

mongoose.promise = global.Promise;

// mongoose.connect(process.env.MONGODB_URI);

mongoose.connect('mongodb://asd:asd123@ds137740.mlab.com:37740/realestate97531');

module.exports = { mongoose };
