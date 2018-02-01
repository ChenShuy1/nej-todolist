const express = require('express')
const router = express.Router()
const db = require('./db')

// 增加一条todo
router.post('/api/todos', function(req, res) {
  const data = req.body;
  var content = data.content
  var isCompleted = data.isCompleted
  if (content) {
    var _id;
    new db.Items({content, isCompleted}).save(function(err, todo) {
      console.log(todo._id);
      _id = todo._id;
      if (err) {
        res.send({success: false, msg: '添加新的todo失败'})
      } else {
        res.send({
          success: true,
          msg: '添加新的todo成功',
          id: todo._id
        })
      }
    });
  }
})

// 删除一条todo
router.delete('/api/todos', function(req, res) {
  var _id = req.query.id;
  db.Items.findByIdAndRemove({_id: _id}, function(err) {
    if (err) {
      res.send({success: false, msg: '删除todo失败'})
    } else {
      res.send({
        success: true,
        msg: '删除todo成功'
      })
    }
  })
})


// 获取所有的todo
router.get('/api/todos', function(req, res) {
  db.Items.find(null, 'content isCompleted', function(err, items) {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify(items))
    }
  })
})

// 修改一条todo
router.put('/api/todos', function(req, res) {
  console.log('in edit');
  var _id = req.query.id
  const data = req.body;
  var content = data.content
  var isCompleted = data.isCompleted
  db.Items.findByIdAndUpdate({_id: _id}, {content, isCompleted}, (err) => {
    if (err) {
      res.send({success: false, msg: '修改todo状态失败'})
    } else {
      res.send({
        success: true,
        msg: '修改todo状态成功'
      })
    }
  })
})

module.exports = router
