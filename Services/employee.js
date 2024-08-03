// Model
const Employee = require('../../../models/Accounts/User/Employee');

// Services
const BaseUserService = require('./baseUser');

const { serialize } = require('../../../utils/tools/codeSerializer');

// Errors

//---------------------------------------------------// Page Break

class EmployeeService extends BaseUserService {
  constructor() {
    super(Employee);
  }

  async create(newUser, uploadedFiles) {
    const currentYear = new Date().getFullYear().toString();
    const count = await this.MongooseClient.count({
      createdAt: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`),
      },
    });

    newUser.body.serialCode = serialize(90, 1, count);

    let employeeData = {};
    employeeData.id = [];
    
    // Gdrive
    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        if (file.type === 'photo'){
          employeeData.photo = file.id;
        }
        if (file.type === 'id') {
          employeeData.id.push(file.id);
        }
      })
    }

    // Multer (aws or local) (!!!!!!dont delete!!!!!)
    // if (newUser.files) {
    //   if (newUser.files.photo) {
    //     employeeData.photo = newUser.files.photo[0].filename;
    //   }

    //   if (newUser.files.id) {
    //   employeeData.id = [...newUser.files.id.map(file => file.filename)];
    // }
    // }
    
    newUser.body.employeeData = employeeData;
    //console.log(newUser.files);


    const result = await this.MongooseClient.create(newUser.body);

    return result;
  }
}

module.exports = EmployeeService;
