const mongoose = require('mongoose');
require('dotenv').config(); 

const resetDB = async () => {
    try {
        // Target specifically the database where you saw the messages
        const dbName = 'pqc-chat-new';
        const uri = `mongodb://127.0.0.1:27017/${dbName}`; 
        
        await mongoose.connect(uri);
        
        console.log(`🔥 Connected to: ${mongoose.connection.name}`);

        // Ye poore database ko uda dega
        await mongoose.connection.db.dropDatabase();
        
        console.log(`✅ Database '${dbName}' Wiped Successfully.`);
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

resetDB();