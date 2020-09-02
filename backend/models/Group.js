const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

let User = new mongoose.model("User", userSchema);

// console.log(User);

module.exports = {
  User,
};

// module.exports=(sequelize,Model)=>{
//     class User extends Model{};
//     User.init({
//         uname:{
//             type:Sequelize.STRING,
//             allowNull:false
//         },
//         pass:{
//             type:Sequelize.STRING,
//             allowNull:false
//         }
//     },{sequelize,modelName:'user',freezeTableName: true});

//     return User;
// }

// module.exports=(sequelize,Model)=>{
//     class Group extends Model{};
//     Group.init({
//         name:{
//             type:Sequelize.STRING,
//             allowNull:false
//         },
//         mem_count:{
//             type:Sequelize.SMALLINT.UNSIGNED,
//             allowNull:false
//         },
//     },{sequelize,modelName:'_group',freezeTableName: true});
//     // Associations
//     Group.belongsTo(User,{foreignKey:'author'},{onDe});

//     return Group;
// }
