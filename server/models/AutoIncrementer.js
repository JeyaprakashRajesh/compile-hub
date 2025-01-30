const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AutoIncrementerSchema = new schema({
    customer_id: {
        type: Number,
        default: 1,
    },
    admin_id: {
        type: Number,
        default: 1,
    }
});

const AutoIncrementer = mongoose.model("AutoIncrementer", AutoIncrementerSchema);

async function getAndIncrementCustomerId() {
    try {
        let autoIncrementDoc = await AutoIncrementer.findOne();
        if (!autoIncrementDoc) {
            autoIncrementDoc = new AutoIncrementer();
            await autoIncrementDoc.save();
        }
        const currentCustomerId = autoIncrementDoc.customer_id;
        autoIncrementDoc.customer_id = currentCustomerId + 1;
        await autoIncrementDoc.save();
        return currentCustomerId;
    } catch (err) {
        console.error("Error in AutoIncrementer:", err);
        throw err;
    }
}

async function getAndIncrementAdminId() {
    try {
        let autoIncrementDoc = await AutoIncrementer.findOne();
        if (!autoIncrementDoc) {
            autoIncrementDoc = new AutoIncrementer();
            await autoIncrementDoc.save();
        }
        const currentAdminId = autoIncrementDoc.admin_id;
        autoIncrementDoc.admin_id = currentAdminId + 1;
        await autoIncrementDoc.save();
        return currentAdminId;
    } catch (err) {
        console.error("Error in AutoIncrementer:", err);
        throw err;
    }
}

module.exports = { AutoIncrementer, getAndIncrementCustomerId, getAndIncrementAdminId };
