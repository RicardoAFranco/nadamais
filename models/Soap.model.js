const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const soapSchema = new Schema(
  {
  imageUrl: String,
  name: { type: String, unique: true, required: true },
  description: String,
  durability: String,
  weight: String,
  price: String
  },
  {
    timestamps: true
  }
);

const Soap = model("Soap", soapSchema);

module.exports = Soap;
