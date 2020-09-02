const Sequelize = require('sequelize');
const e = require('express');
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

// class Message extends Model{}
// // from,to - can be userid or groupid,content
// Message.init({
//     from:{
//         type:Sequelize.INTEGER,
//         references: {
//             // This is a reference to another model
//             model: User,
//             // This is the column name of the referenced model
//             key: 'id',
//           }
//     },
//     to:{
//         type:Sequelize.INTEGER,
//         references: {
//             model: User,
//             key: 'id',
//           }
//     },
//     content:{
//         type:Sequelize.STRING,
//         allowNull:false
//     }
// },{sequelize,modelName:'message',freezeTableName: true});

// Message.belongsTo(User,{foreignKey:'from'});
// Message.belongsTo(User,{foreignKey:'to'});

// class Contact extends Model{}
// Contact.init({
//     whose:{
//         type:Sequelize.INTEGER,
//         references: {
//             // This is a reference to another model
//             model: User,
//             // This is the column name of the referenced model
//             key: 'id',
//             // This declares when to check the foreign key constraint. PostgreSQL only.
//             // deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
//           }
//     },
//     who:{
//         type:Sequelize.INTEGER,
//         references: {
//             // This is a reference to another model
//             model: User,
//             // This is the column name of the referenced model
//             key: 'id',
//             // This declares when to check the foreign key constraint. PostgreSQL only.
//             // deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
//           }
//     },
// },{sequelize,modelName:'contact',freezeTableName:true})

class Contact extends Model{}
Contact.init({
    id:{
        type:Sequelize.INTEGER,
        unique:true,
        autoIncrement:true,
        primaryKey:true
    }
},{sequelize,modelName:'contact',freezeTableName:true})

class Message extends Model{}
Message.init({
    content:{
        type:Sequelize.STRING,
        allowNull:false
    }
},{sequelize,modelName:'message',freezeTableName: true});


// Relationships

    // 1. Contacts
// User.belongsToMany(User,{as:'Contact',through:'Contacts', foreignKey: 'userId' })
// User.belongsToMany(User,{as:'User',through:'Contacts', foreignKey: 'contactId' })
// User.belongsToMany(User,{through:'Contacts',foreignKey:'contactId',otherKey:'userId'})
User.belongsToMany(User,{as:'Contact',through:Contact});
// User.belongsToMany(User,{as:'kon',through:Contact});
Contact.belongsToMany(Message,{through:'Message_Contacts'})
Message.belongsToMany(Contact,{through:'Message_Contacts'})
// Contact.belongsTo(Message)
    // 2. Messages
// Contacts.belongsToMany(Mes,{as:'Sender',through:'Messages', foreignKey: 'from' }) //User1.addSender(USer2) => User1 sent a message to User2
// User.belongsToMany(User,{as:'Recipient',through:'Messages', foreignKey: 'to' })

// Driver Code
sequelize
.authenticate()
.then(() => {
    console.log('Connection with MYSql has been established successfully.');
    
    // createModels();
    
    sequelize.sync().then(async()=>{
        // console.log(Group.setUsers);
        console.log("Database synced");
        // await seedDB()
        let ramas=await User.findOne({
            where:
            {
                uname:'ramas',
            }
        })
        
        let samar=await User.findOne({
            where:
            {
                uname:'samar',
            }
        })
        
        // console.log(samar);
        // let res=await samar.addContact(ramas);
        // let msg=await Message.create({
            // content:'Hello ramas from samar!!'
        // })
        let con=await Contact.findOne({
            where:{
                userId:2,
                ContactId:1
            }
        })
        let res=await con.getMessages();
        console.log(res);
        // await ramas.addContact(samar)
        if(res)
            console.log('\n\n***** Added Contact *****\n\n');
        else
            console.log('\n\n***** Contact already exists *****\n\n');
    })
})

.catch(err => {
    console.error('Unable to connect to the database:', err);
});
async function seedDB()
{
    let ramas=await User.create({
        uname:'ramas',
        pass:'1234'
    })
    
    let samar=await User.create({
        uname:'samar',
        pass:'1234'
    })
}
module.exports={
    sequelize,User,Group,Message
}