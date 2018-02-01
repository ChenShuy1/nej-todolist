const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
  content: String,
  isCompleted: Boolean
})

const Model = {
  Items: mongoose.model('Items', itemSchema)
}

mongoose.connect('mongodb://127.0.0.1/todolist')
const db = mongoose.connection

db.on('error', function () {
  console.log('数据库连接失败...')
})

db.on('open', function () {
  console.log('数据库连接成功...')
})

module.exports = Model
