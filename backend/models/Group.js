module.exports=(sequelize,Model)=>{
    class Group extends Model{};
    Group.init({
        name:{
            type:Sequelize.STRING,
            allowNull:false
        },
        mem_count:{
            type:Sequelize.SMALLINT.UNSIGNED,
            allowNull:false
        },
    },{sequelize,modelName:'_group',freezeTableName: true});
    // Associations
    Group.belongsTo(User,{foreignKey:'author'},{onDe});
    
    return Group;
}