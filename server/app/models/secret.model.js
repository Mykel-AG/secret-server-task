const { nanoid } = require('nanoid');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

module.exports = mongoose => {
    const Secret = mongoose.model(
        "secret",
        mongoose.Schema(
            {
                hash: { type: String, default: () => nanoid(), unique: true, required: true, dropDups: true },
                secretText: { type: String, required: true },
                expiresAt: { type: Date }
            },
            {
                timestamps: { createdAt: true, updatedAt: false },
                toJSON: {
                    transform: function (doc, ret) {
                        delete ret._id;
                        delete ret.__v;
                        delete ret.__enc_hash;
                        delete ret.__enc_secretText;
                    }
                }
            }
        ).plugin(mongooseFieldEncryption, { 
            fields: ["hash", "secretText"], 
            secret: process.env.SALT_SECRET,
            saltGenerator: (secret) => secret.slice(0, 16)
          })
   
    );
    return Secret;
};