import mongoose from "mongoose"

const EmployeeSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    birthday:{
        type: String,
        required: true,
        default: "dd/mm/yyyy",
    },
    password:{
        type: String,
        required: true,
    }
})

const EmployeeModel = mongoose.model("employee", EmployeeSchema)

export default EmployeeModel