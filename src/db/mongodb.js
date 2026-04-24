import mongoose from 'mongoose'

const connectMongoDB = async (uri) => {
    return mongoose.connect(uri)
}

export default connectMongoDB