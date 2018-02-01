var f = function() {
  var _ = NEJ.P,
      _e = _('nej.e'),
      _v = _('nej.v'),
      _j = _('nej.j'),
      _u = _('nej.u'),
      _p = _('nej.ut');
  // api.js
  // 添加一条todo
  var addTodo = function(content, isCompleted = false) {
    return new Promise(function(resolve, reject) {
      _j._$request('/api/todos', {
        sync: false,
        type: 'json',
        method: 'post',
        data: `content=${content}&isCompleted=${isCompleted}`,
        onload: function(_res) {
          resolve(_res);
        },
        onerror: function(_error) {
          reject(_error)
        }
      });
    })
  }
  // 获取所有todos
  var getTodos = function() {
    return new Promise(function(resolve, reject) {
      _j._$request('/api/todos', {
        sync: false,
        type: 'json',
        method: 'get',
        onload: function(_res) {
          resolve(_res);
        },
        onerror: function(_error) {
          reject(_error);
        }
      })
    })
  }
  // 删除某一条todo
  var deleteTodo = function(id) {
    return new Promise(function(resolve, reject) {
      _j._$request('/api/todos', {
        sync: false,
        method: 'delete',
        query: `id=${id}`,
        onload: function(_res) {
          resolve(JSON.parse(_res));
        },
        onerror: function(_error) {
          reject(_error);
        }
      })
    })
  }
  // 修改todo状态或内容
  var editTodo = function(id, content, isCompleted) {
    return new Promise(function(resolve, reject) {
      _j._$request('/api/todos', {
        sync: false,
        type: 'json',
        method: 'put',
        query: `id=${id}`,
        data: `content=${content}&isCompleted=${isCompleted}`,
        onload: function(_res) {
          resolve(_res);
        },
        onerror: function(_error) {
          reject(_error)
        }
      });
    })
  }

  // 进入即获取所有的todos并显示
  getTodos().then(function(res) {
    var todos = res;
    _u._$forEach(todos, function(_todo, _index, _todos) {
      add2List(_todo._id, _todo.content, _todo.isCompleted);
    });
  })

  var inputBox = _e._$get('todo');
  var listBox = _e._$get('list');
  var counter = _e._$get('counter');
  var clearBox = _e._$get('clear');
  var downBox = _e._$get('down');
  var currentStatus = 'all';
  // 设置双向数据绑定，在修改all的值时会通知
  var statusCouter = {
    active: 0,
    completed: 0,
    all: 0,
  };
  var bindAll = statusCouter.all;
  var defineGetAndSet = function(obj, propname) {
    Object.defineProperty(obj, propname, {
      get: function() {
        return bindAll;
      },
      set: function(value){
        bindAll = value;
        if (bindAll === 0 || bindAll !== obj.completed) {
          if (bindAll === 0) {
            _e._$delClassName(downBox, 'down-light');
            _e._$delClassName(downBox, 'down-dark');
            _e._$addClassName(downBox, 'down-none');
          } else {
            _e._$delClassName(downBox, 'down-none');
            _e._$delClassName(downBox, 'down-dark');
            _e._$addClassName(downBox, 'down-light');
          }
        } else {
          _e._$delClassName(downBox, 'down-light');
          _e._$delClassName(downBox, 'down-none');
          _e._$addClassName(downBox, 'down-dark');
        }
      },
      enumerable: true,
      configurable: true
    })
  };
  //设置需要被劫持的元素
  defineGetAndSet(statusCouter, 'all');

  // 添加事件到列表中
  var add2List = function(id, content, isCompleted) {
    // 创建事件实例用于插入到事件列表中
    var event = _e._$create("div", "event", "list");
    _e._$attr(event, 'id', id);
    var status = isCompleted === true ? 'completed' : 'active';
    _e._$attr(event, 'status', status);
    // 如果当前状态与tab选中状态不一致则不显示
    if (currentStatus !== 'all' && currentStatus !== _e._$attr(event, 'status')) {
      _e._$addClassName(event, 'noshow');
    }

    var input = _e._$create("input");
    event.innerHTML = '<input type="checkbox" name="default" value="default" class="checkbox"> \
    <label for="default" class="label"> \
      <span class="content">' + content + '</span> \
      <input class="noshow editor" type="text" /> \
    </label> \
    <img class="icon hide" src="/images/delete.png" alt="delete" width="20px" height="20px">';

    var deleteIcon = _e._$getChildren(event, 'icon')[0];
    var checkbox = _e._$getChildren(event, 'checkbox')[0];
    var label = _e._$getChildren(event, 'label')[0];
    // 监听事件的修改
    _v._$addEvent(label, "dblclick", _onEventDoubleClick);
    // 监听事件的悬浮
    _v._$addEvent(event, "mouseOver", _onEventHover);
    // 监听事件的离开
    _v._$addEvent(event, "mouseLeave", _onEventOut);
    // 监听删除键的点击
    _v._$addEvent(deleteIcon, "click", _onEventDelete);
    // 监听完成键的点击
    _v._$addEvent(checkbox, "click", _onEventCheck);

    // 设置总体status的计数
    if (isCompleted) {
      changStatusCounter(1, 1, 0);
      checkbox.setAttribute('checked', 'checked');
      // 修改list中事件的状态
      _e._$attr(event, 'status', 'completed');
    } else {
      changStatusCounter(1, 0, 1);
      counter.innerHTML = Number(counter.innerHTML) + 1;
    }
  }

  // 监听输入框的点击事件
  var _onInputEnter = function(_event) {
    // 获取具体事件
    var e = this.value;
    var that = this;
    if (_event.keyCode == "13" && e !== '') {
      addTodo(e, false).then(function(res) {
        if(res.success) {
          add2List(res.id, e, false);
          // 清空输入框
          that.value = '';
        }
      })
    }
  }

  // 监听清除的点击事件
  var _onEventClear = function(_event) {
    var events = _e._$getChildren('list');
    _u._$forEach(events, function(event, index, events) {
      var status = _e._$attr(event, 'status');
      if (status === 'completed') {
        _v._$dispatchEvent(_e._$getChildren(event, 'icon')[0], 'click');
      }
    });
  }
  // 监听全选的点击事件
  var _onDownClick = function(_event) {
    var events = _e._$getChildren('list');
    var allCompleted = (statusCouter.all !== statusCouter.completed);
    _u._$forEach(events, function(event, index, events) {
      var status = _e._$attr(event, 'status');
      var checkbox = _e._$getChildren(event, 'checkbox')[0];
      // 全部完成
      if (allCompleted && status === 'active') {
        checkbox.click();
      }
      // 全部激活
      if (!allCompleted && status === 'completed'){
        checkbox.click();
      }
    });
  }

  // 绑定事件在输入框上
  _v._$addEvent(inputBox, "keyup", _onInputEnter._$bind2(inputBox));
  // 绑定事件在清除键上
  _v._$addEvent(clearBox, "click", _onEventClear);
  // 绑定事件在全选键上
  _v._$addEvent(downBox, "click", _onDownClick);

  // 监听每个事件的删除键的点击
  var _onEventDelete = function(_event) {
    if (_event.target && _event.target.nodeName === 'IMG') {
      var event = _event.target.parentNode;
      var id = _e._$attr(event, 'id');
      var status = _e._$attr(event, 'status');
      deleteTodo(id).then(function(res) {
        if(res.success) {
          if (status === 'active') {
            counter.innerHTML = Number(counter.innerHTML) - 1;
            changStatusCounter(-1, 0, -1);
          } else {
            changStatusCounter(-1, -1, 0);
          }
          _e._$remove(event, true);
        }
      })

    }
  }
  // 监听每个事件的点击修改
  var _onEventDoubleClick = function(_event) {
    if (_event.target && _event.target.nodeName === 'SPAN') {
      var label = _event.target.parentNode;
      var span = _event.target;
      var editor = _e._$getChildren(label, 'editor')[0];
      var value = span.innerHTML;
      _e._$addClassName(span,'noshow');
      _e._$delClassName(editor, 'noshow');
      editor.value = value;
      _v._$addEvent(editor, "keyup", _onEventEditComplete);
      _v._$addEvent(editor, "blur", _onEventEditComplete);
    }
  }
  // 监听修改完成
  var _onEventEditComplete = function(_event) {
    if (_event.keyCode === undefined || _event.keyCode === 13) {
      var label = _event.target.parentNode;
      var event = label.parentNode;
      var value = _event.target.value;
      var editor = _event.target;
      var span = _e._$getChildren(label, 'content')[0];
      var id = _e._$attr(event, 'id');
      var isCompleted = _e._$attr(event, 'status') === 'active' ? false : true;
      editTodo(id, value, isCompleted).then((res) => {
        if (res.success) {
          span.innerHTML = value;
        }
        _e._$delClassName(span, 'noshow');
        _e._$addClassName(editor, 'noshow');
      })
    }
  }
  // 监听鼠标的悬停在事件上
  var _onEventHover = function(_event) {
    if (_event.target && _event.target.nodeName === 'DIV') {
      var deleteIcon = _e._$getChildren(_event.target, 'hide')[0];
      if (deleteIcon) {
        _e._$delClassName(deleteIcon, 'hide');
        _e._$addClassName(deleteIcon, 'show');
      }
    }
  }
  // 监听鼠标的移出事件
  var _onEventOut = function(_event) {
    if (_event.target && _event.target.nodeName === 'DIV') {
      var deleteIcon = _e._$getChildren(_event.target, 'show')[0];
      if (deleteIcon) {
        _e._$delClassName(deleteIcon, 'show');
        _e._$addClassName(deleteIcon, 'hide');
      }
    }
  }
  // 监听checkbox的点击事件
  var _onEventCheck = function(_event) {
    var checked = _e._$attr(_event.target, 'checked');
    var event = _event.target.parentNode;
    var label = _e._$getChildren(event, 'label')[0];
    var span = _e._$getChildren(label, 'content')[0];
    var index = _e._$attr(event, '_index');
    var id = _e._$attr(event, 'id');
    var status = _e._$attr(event, 'status');
    var isCompleted = status === 'active' ? true : false;
    editTodo(id, span.innerHTML, isCompleted).then(function(res) {
      if (res.success) {
        if (!checked) {
          _event.target.setAttribute('checked', 'checked');
          _e._$addClassName(span, 'completed');
          // 修改list中事件的状态
          _e._$attr(event, 'status', 'completed');
          // 设置总体status的计数
          changStatusCounter(0, 1, -1);
          counter.innerHTML = Number(counter.innerHTML) - 1;
        } else {
          _event.target.removeAttribute('checked');
          _e._$delClassName(span, 'completed');
          // 修改list中事件的状态
          _e._$attr(event, 'status', 'active');
          // 设置总体status的计数
          changStatusCounter(0, -1, 1);
          counter.innerHTML = Number(counter.innerHTML) + 1;
        }

        if (currentStatus === 'completed') filter('completed');
        if (currentStatus === 'active') filter('active');
      }
    });
  }

  //tab模块，使用tab控件
  _e._$tab('tab',{
    index:0,
    onchange:function(_event){
      var index = _event.index;
      var _list;
      switch (index) {
        case 1:
          filter('active');
          break;
        case 2:
          filter('completed');
          break;
        default:
          filter('all');
      }
    }
  })

  function filter(condition) {
    currentStatus = condition;
    // 获取列表中所有的子元素
    var events = _e._$getChildren('list');
    _u._$forEach(events, function(event, index, events) {
      _e._$delClassName(event, 'noshow');
      var status = _e._$attr(event, 'status');
      if (condition !== 'all' && status !== condition) {
        _e._$addClassName(event, 'noshow');
      }
    });
  }

  function changStatusCounter(all, completed, active) {
    statusCouter.completed += completed;
    statusCouter.active += active;
    statusCouter.all += all;
  }
}

define(['{lib}base/event.js', '{lib}util/template/tpl.js', '{lib}util/tab/tab.js', '{lib}util/ajax/xdr.js'], f);
