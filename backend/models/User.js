module.exports=(sequelize,Model)=>{
    class User extends Model{};
    User.init({
        uname:{
            type:Sequelize.STRING,
            allowNull:false
        },
        pass:{
            type:Sequelize.STRING,
            allowNull:false
        }
    },{sequelize,modelName:'user',freezeTableName: true});
    
    return User;
}