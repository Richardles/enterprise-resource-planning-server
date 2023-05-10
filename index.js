import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import EmployeeModel from "./models/employee.js"
import AttendanceModel from "./models/attendance.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MDB_CONNECT).catch(error => {
    console.log(error);
    // console.error.bind(console, 'connection error:')
})

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
})

app.get("/getEmployees", async (req, res)=>{
    const employees = await EmployeeModel.find({})
    res.json(employees)
    console.log(employees);
})

app.post("/getOneEmployee", async (req, res)=>{
    console.log(req.body.email)
    console.log(req.body.password)
    const employee = await EmployeeModel.findOne({email: req.body.email})
    console.log(employee);
    if(employee){
        if(employee.password === req.body.password){
            res.json(employee)
        }else{
            res.json("hold")
        }
    }else{
        res.json("hold")
    }
})

app.post("/getAttendanceByEmail", async (req, res)=>{
    const attendances = await AttendanceModel.find({employeeEmail: req.body.employeeEmail})
    res.json(attendances)
    console.log(attendances);
})

app.post("/insertEmployee", async (req, res)=>{
    const employee = req.body
    console.log(employee);
    const newEmployee = new EmployeeModel(employee)
    try {
        await newEmployee.save()
        res.json(employee)
    } catch (error) {
        res.json(error)
    }
})

app.post("/insertAttendance", async (req, res)=>{
    const attendance = req.body
    const oldAttendance = await AttendanceModel.findOne({
        employeeEmail: req.body.employeeEmail,
        attendDate: req.body.attendDate
    })
    const newAttendance = new AttendanceModel(attendance)
    console.log(newAttendance);
    console.log('=-=');
    console.log(oldAttendance);
    if(oldAttendance === null){
        try {
            await newAttendance.save()
            res.json(newAttendance)
        } catch (error) {
            res.json(error)
        }
    }else{
        if (oldAttendance.clockInTime == '-'){
            const update = {
                clockInTime: attendance.clockInTime,
                description: attendance.description
            }
            const updated = await AttendanceModel.findOneAndUpdate({
                employeeEmail: req.body.employeeEmail,
                attendDate: req.body.attendDate
            },update,{new: true})
            res.json(updated)
        }else{
            const update = {description: attendance.description}
            const updated = await AttendanceModel.findOneAndUpdate({
                employeeEmail: req.body.employeeEmail,
                attendDate: req.body.attendDate
            },update,{new: true})
            res.json(updated)
        }
    }
})

app.post("/updateOneAttendance", async(req, res)=>{
    const attendance = req.body
    const oldAttendance = await AttendanceModel.findOne({
        employeeEmail: req.body.employeeEmail,
        attendDate: req.body.attendDate
    })
    const newAttendance = new AttendanceModel(attendance)
    console.log(newAttendance);
    console.log('====');
    console.log(oldAttendance);
    if(oldAttendance === null){
        try {
            await newAttendance.save()
            res.json(attendance)
        } catch (error) {
            res.json(error)
        }
    }else{
        const update = {
            clockOutTime: attendance.clockOutTime,
            description: attendance.description
        }
        const updated = await AttendanceModel.findOneAndUpdate({
            employeeEmail: req.body.employeeEmail,
            attendDate: req.body.attendDate
        },update,{new: true})
        res.json(updated)
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
})