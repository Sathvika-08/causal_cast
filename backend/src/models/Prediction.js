import mongoose from 'mongoose'

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  ticker: { type: String },
  request: { type: Object },
  result: { type: Object },
}, { timestamps: true })

export default mongoose.model('Prediction', predictionSchema)


