import mongoose from 'mongoose'
import  {db_string} from '../config'
mongoose.connect(db_string);
// import { Schema, model } from 'mongoose';
// u’re importing the Schema constructor and the model function

const contentTypes:string[] = ['image' , 'video' , 'article' , 'audio'];

const schema1 = new mongoose.Schema({
    username: { type: String ,required:true , unique:true , trim:true , minlength:3 , maxlength:30  } ,
    share : Boolean,
    password: { type:String , required:true , unique:false , minlength:8 ,
                validate : {
                    validator :async function (password:string){
                        const hasUppercase =  /[A-Z]/.test(password) ;
                        const hasLowercase =  /[a-z]/.test(password) ;
                        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password) ;

                        return hasUppercase && hasLowercase && hasSpecialChar;
                    },
                    message: "Password must contain one lowercase one upperacse and one special charcter"
                }
    }
});
// ref takes model name 
const schema2 = new mongoose.Schema({
    link : {type:String , required:true} ,
    type : {type :String , enum:contentTypes , required:true} ,
    title : {type:String , required:true} ,
    tags : [{type: mongoose.Schema.Types.ObjectId , ref:'Tag'}] ,
    userId : {type:mongoose.Schema.Types.ObjectId  , ref:'User' , 
        validate :{
            validator: async function (Id : mongoose.Schema.Types.ObjectId){
                // accessing the model with model name bcoz model variable could not be defined yet 
                const user = await mongoose.model('User').findOne({_id : Id});
                return !!user; // !! is something is there it will not return its credentials it will 
                // return true or false
            },
            message : "Referenced user does not exist"
        }
    }
})

const schema3 = new mongoose.Schema({
    title : {type:String , lowercase: true}  // we want all tags to be in lowercase
})

const schema4 = new mongoose.Schema({
    hash : String ,
    userId : {type:mongoose.Schema.Types.ObjectId , ref:'User'}
})

const User = mongoose.model('User' , schema1);
const Content = mongoose.model('Content' , schema2);
const Tag = mongoose.model('Tag' , schema3);
const Link = mongoose.model('Link' , schema4);
export{User , Content , Tag , Link} ;

// In this line
// export const Tag = mongoose.model('Tag' , schema3);
// 'Tag' (the string parameter) = Model name
// Tag (the variable name) = Just a JavaScript variable name for exporting
// Collection name is automatically generated by Mongoose:

// Mongoose takes the model name 'Tag'
// Converts it to lowercase and pluralizes it
// So collection name becomes 'tags'