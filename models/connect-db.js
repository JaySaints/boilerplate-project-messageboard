const mongoose = require('mongoose');

module.exports =  {
    start: async () => {
        try {
            await mongoose.set('strictQuery', true);
            await mongoose.connect(process.env.MONGO_DB);
            console.log("\u2705 Connection with MongoDB")
        } catch (error) {
            console.log("\u26D4 Connection with MongoDB")
            console.error(error)
        }
    }
}

