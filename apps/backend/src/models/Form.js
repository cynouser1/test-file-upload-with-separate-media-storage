// models/Form.js
import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // collection name matches your User model
      required: true,
    },
    published: { type: Boolean, default: false },
    expiresAt: { type: Date }, // Expiry date/time
    submissionUrl: { type: String }, // Unique public URL
    loginRequired: { type: Boolean, default: false }, // Require login?
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate forms by the same user
// formSchema.index({ userId: 1, formKey: 1 }, { unique: true });

const Form = mongoose.model("forms", formSchema);
export default Form;
// module.exports = Form;
