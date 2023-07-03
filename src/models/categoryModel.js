const mongoose = require('mongoose');

const categorySchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Category name is required'],
        unique:[true,'Category name must be unique'],
        minlength:[3,'Category name can not be less than 3 chars'],
        maxlength:[32,'Category name can not exceed 32 chars']
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:{
        type:String
    }
},
    {timestamps:true}
);

// categorySchema.pre('save',()=>{
//     this.slug = this.name.split(' ').join('-').toLocaleLowerCase()
// })

const Category = mongoose.model('Category' , categorySchema);

module.exports = Category