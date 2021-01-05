let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let commic = new Schema(
  {
    url: String,
    name: String,
    alternative: String,
    authors: String,
    image: {
      type: String,
    },
    team: String,
    status: Number,
    views: Number,
    rent: Boolean,
    price:Number,
    genres: [
      {
        type: String,
      },
    ],
    description: String,
    hot: Number,
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: "chapter",
      },
    ]
  },
  { timestamps: true }
);
module.exports = mongoose.model("comic", commic);
