import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9\s]+$/.test(v) && v.length <= 100;
            },
            message: 'User field must be alphanumeric'
        }
    },
    action: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9\s_-]+$/.test(v) && v.length <= 200;
            },
            message: 'Action field must be alphanumeric with basic symbols'
        }
    },
    timestamp: { type: Date, default: Date.now }
});

const auditLogModel = mongoose.models.auditlog || mongoose.model("auditlog", auditLogSchema);

export default auditLogModel; 