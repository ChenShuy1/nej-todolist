
var addTodo = function(content, isCompleted = false) {
  return new Promise(function(resolve, reject) {
    _j._$request('/api/add', {
      sync: true,
      type: 'json',
      method: 'post',
      data: 'content=1&isCompleted=true',
      query:'a=1&b=2',
      onload: function(_res) {
        resolve(_res);
      },
      onerror: function(_error) {
        reject(_error)
      }
    });
  })
}

// define(['{lib}base/event.js', '{lib}util/ajax/xdr.js'], f);
