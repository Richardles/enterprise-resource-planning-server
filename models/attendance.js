import mongoose from "mongoose"

const AttendanceSchema = new mongoose.Schema({
    employeeId:{
        type: String,
        required: true,
    },
    employeeEmail:{
        type: String,
        required: true
    },
    clockInTime:{
        type: String,
        required: true,
        unique: true,
    },
    clockOutTime:{
        type: String,
        required: true,
    },
    attendDate:{
        type: Date,
        required: true,
        default: new Date(),
    },
    description:{
        type: String,
        required: true
    }
})

const AttendanceModel = mongoose.model("attendance", AttendanceSchema)

export default AttendanceModel