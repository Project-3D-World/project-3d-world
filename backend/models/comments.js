import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    author:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
    },
    worldId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,

    },
    chunk:{
        x:Number,
        z:Number,
    },
    content:{
        type:String,
        required:true
    }
})
export const Comments = mongoose.model("Comments",commentSchema);