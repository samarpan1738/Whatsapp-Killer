const Sequelize = require('sequelize');
const {Model}=Sequelize;
const sequelize = new Sequelize('whatsappkiller', 'wkAdmin', '555roots555', {
    host: 'localhost',
    dialect:'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

/*
STEPS:
1) Create a model (Automatic pluralization in db)
2) Sync it with database
*/

class User extends Model{};
User.init({
    uname:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
        // primaryKey: true
    },
    pass:{
        type:Sequelize.STRING,
        allowNull:false
    }
},{sequelize,modelName:'user',freezeTableName: true});

class Group extends Model{};
// id,name,member count,author
Group.init({
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    mem_count:{
        type:Sequelize.SMALLINT.UNSIGNED,
        allowNull:false
    },
    author:{
        type:Sequelize.STRING,
        references: {
            model: User,
            key: 'uname',
          }
    }
},{sequelize,modelName:'_group',freezeTableName: true});

class Message extends Model{}
// from,to - can be userid or groupid,content
Message.init({
    from:{
        type:Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: User,
            // This is the column name of the referenced model
            key: 'id',
          }
    },
    to:{
        type:Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id',
          }
    },
    content:{
        type:Sequelize.STRING,
        allowNull:false
    }
},{sequelize,modelName:'message',freezeTableName: true});

// Message.belongsTo(User,{foreignKey:'from'});
// Message.belongsTo(User,{foreignKey:'to'});

class Contact extends Model{}
Contact.init({
    whose:{
        type:Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: User,
            // This is the column name of the referenced model
            key: 'id',
            // This declares when to check the foreign key constraint. PostgreSQL only.
            // deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          }
    },
    who:{
        type:Sequelize.INTEGER,
        references: {
            // This is a reference to another model
            model: User,
            // This is the column name of the referenced model
            key: 'id',
            // This declares when to check the foreign key constraint. PostgreSQL only.
            // deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          }
    },
},{sequelize,modelName:'contact',freezeTableName:true})
// Contact.belongsTo(User,{foreignKey:'whose'});
// Contact.belongsTo(User,{foreignKey:'who'});

// Group.hasOne(User, {as: "Author"});
// Group.belongsTo(User,{foreignKey:'author'});
// User.hasMany(Group,);
// Group.hasMany(User,{constraints: false});

// User.hasOne(Group, {as: "Author"});

// class Member extends Model{}
// Member.init({},{sequelize,modelName:'member',freezeTableName: true})
// Member.hasMany(Group);
// Member.hasMany(User);

// Group.belongsToMany(User, {through: 'Member',foreignKey:'gid'});
// User.belongsToMany(Group, {through: 'Member',foreignKey:'uid'});
// Member
  // Start connection
sequelize
.authenticate()
.then(() => {
    console.log('Connection with MYSql has been established successfully.');
    
    // createModels();
    
    sequelize.sync().then(()=>{
        // console.log(Group.setUsers);
        console.log("Database synced");
    })
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports={
    sequelize,User,Group,Message,Contact
}