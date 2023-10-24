const mongoose = require('mongoose');

const UserModel = require('../models/userModel');
const ProjectModel = require('../models/projectModel');




const memberSchema = new mongoose.Schema({
   memberId: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
         required: true
      }
   ]
   ,
   deptId: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'depts',
         required: true
      }
   ],
   position: {
      type: String,
      required: true
   }
}, {
   _id: false,
   versionKey: false // You should be aware of the outcome after set to false
});


const memberModel = mongoose.model('Members', memberSchema);



module.exports = memberModel;