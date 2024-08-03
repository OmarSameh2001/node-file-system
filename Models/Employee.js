/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const baseUser = require('./BaseUser');

let employeeSchema = new mongoose.Schema({
  employeeData: {
    nationalId: {
      front: String,
      back: String,
    },
    contract: String,
    photo: String,
    id: Array,
  },
});

baseUser.discriminator('employee', employeeSchema);
module.exports = mongoose.model('employee');