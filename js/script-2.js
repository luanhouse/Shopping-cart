/**
 * Created by House on 2017/1/6.
 */
window.onload = function () {
  var cartTable = document.getElementById('cartTable');
  var tr = cartTable.children[1].rows;
  var checkInput = document.getElementsByClassName('check');
  var checkAllInput = document.getElementsByClassName('check-all');
  var selectedTotal = document.getElementById('selectedTotal');
  var priceTotal = document.getElementById('priceTotal');
  var selected = document.getElementById('selected');
  var foot = document.getElementById('foot');
  var selectedViewList = document.getElementById('selectedViewList');
  var deleteAll = document.getElementById('deleteAll');

  //总价计算函数
  function getTotal() {
    var selected = 0;
    var price = 0;
    var HTMLstr = '';

    for ( i = 0 ; i < tr.length ; i++) { //for 循环对所有 tr 行进行遍历
      if (tr[i].getElementsByTagName('input')[0].checked) { //如果 tr 中第一个选择框被选中
        tr[i].className = 'on'; //改变该 tr 的 className
        selected += parseInt(tr[i].getElementsByTagName('input')[1].value); //加上原有 selected 值，并把结果转换成整数
        price += parseFloat(tr[i].cells[4].innerHTML); //加上原有的 price 并把结果转换成浮点数
        HTMLstr += '<div><img src="'+ tr[i].getElementsByTagName('img')[0].src +'" />' +
          '<span class="del" index = "'+i+'">取消选择</span></div>'; //往原有的 HTMLstr 里面添加内容

      }
      else {
        tr[i].className = ''; //否则更改 className 为空
        foot.className = 'foot'; //并重置底部显示状态
      }
    }
    selectedTotal.innerHTML = selected; //更新总计已选商品数目
    priceTotal.innerHTML = price.toFixed(2); //把总价内容转化成两位小数的数字
    selectedViewList.innerHTML = HTMLstr; //更新图片展示内容
  }

  //小计价格计算函数
  function getSubTotal(tr) {
    var tds = tr.cells; //取得一行 tr 之中所有的单元格
    var price = parseFloat(tds[2].innerHTML);
    var count = parseInt(tr.getElementsByTagName('input')[1].value);
    tds[4].innerHTML=  parseFloat(price * count).toFixed(2); //小计价格单元格内容计算结果
  }

  for (i = 0; i < checkInput.length ; i++ ) { //遍历所有选择框
    checkInput[i].onclick = function () { //当选择框被点击执行的函数
      if (this.className === 'check-all check') { //判断选择框的 className 若是全选框
        for (j = 0; j < checkInput.length ; j++ ) { //对所有选择框进行遍历
          checkInput[j].checked = this.checked; //更改所有选择框为已选择状态
        }
      }
      if (this.checked == false) { //判断当前选择框若是取消选择
        for (k = 0; k < checkAllInput.length; k++) { //对所有全选按钮进行遍历
          checkAllInput[k].checked = false; //更改全选按钮状态为未选择
        }
      }
      getTotal(); //在选择框状态改变之后，更新一次总价计算函数
    }
  }

  selected.onclick = function () { //缩略图展示部分被点击后执行的函数
    if (foot.className == 'foot') { //判断若当前底部的 className 若是 foot
      if (selectedTotal.innerHTML != 0) { //再判断当前所有已选商品数量若不是 0
        foot.className = 'foot show'; //则更改底部的 className 为 foot show
      }
    }
    else {
      foot.className = 'foot'; //否则隐藏底部缩略图展示
    }
  };

  selectedViewList.onclick = function (e) { //缩略图展示部分被点击之后
    var el = e.srcElement;  //通过事件 e 的方式找到发生该事件的元素 srcElement
    if (el.className == 'del') { //判断如果发生此事件的元素 className 若是 del
      var index = el.getAttribute('index');
      var input = tr[index].getElementsByTagName('input')[0];
      input.checked = false; //则更改对应已选选择框为未选择
      input.onclick(); //并执行一次此选择框点击事件
    }
  };

  //数量加减函数
  for (i = 0; i < tr.length; i++) { //对 tr 自元素进行遍历
    tr[i].onclick = function (e) { //当某个 tr 被点击
      var el = e.srcElement; //通过 e 事件的方式找到该元素 srcElement
      var cls = el.className; //声明一个变量为该被点击元素的 className
      var input = this.getElementsByTagName('input')[1]; //声明一个变量为该数量输入框
      var val = parseInt(input.value); //声明一个变量，为转换为整数之后的输入框数目
      var reduce = this.getElementsByTagName('span')[1]; //选择到数量减少按钮

      switch (cls) { //用 switch 对多种可能的情况进行判断，并把被点击元素的 className 以参数传入
        case 'add': //若 className 为 add
          input.value = val + 1; //数目框数字加一
          reduce.innerHTML = '-'; //减少按钮可见
          getSubTotal(this); //更新一次当前数目更改后的小计价格
          break;
        case 'reduce': //若 className 为 reduce
          if (input.value > 1){ //判断数值若大于一
            input.value = val - 1; //数目减一
            if (input.value <= 1) { //判断数值若小于等于一
              reduce.innerHTML = ''; //减少按钮不可见
            }
          }
          getSubTotal(this); //更新一次当前数目更改后的小计价格
          break;

        case 'delete': //若 className 为 delete
          var conf = confirm('确定要删除吗？'); //弹出提示框再次确认
          if(conf) { //若选择确定按键
            this.parentNode.removeChild(this); //remove 当前 tr 的父节点 的 子节点（即自身）
          }
          break;
        default:
          break;
      }
      getTotal(); //更新一次当前数目更改后的总计价格
    };
    tr[i].getElementsByTagName('input')[1].onkeyup = function () { //选择到商品数量输入框，当键盘弹起时执行以下函数
      var val = parseInt(this.value); //取得当前输入框数值并转换为证书
      var tr = this.parentNode.parentNode; //选择到当前输入框的 父节点（td）的 父节点（tr）
      var reduce = tr.getElementsByTagName('span')[1]; //选择到当前 tr 中第二个 span 标签
      if (isNaN(val) || val < 1) { //判断若当前输入值 NaN 或小于一
        val = 1; //则当前数值改变为1
      }
      this.value = val; //当前输入框数值为 val （即是1）
      if (val <= 1 ) { //若当前输入框数值小于等于一
        reduce.innerHTML = ''; //减少按钮内容为空
      }
      reduce.innerHTML = '-'; //否则（即若大于一），减少输入框内容为 -
      getSubTotal(tr); //输入结束后更新一次当前行的小计
      getTotal(); //输入结束后更新一次总价计算
    }
  }

  deleteAll.onclick =function () { //删除所有按键被点击后执行以下函数
    if (selectedTotal.innerHTML != '0') { //判断如果总计数量不为 0
      var conf = confirm('确定要删除全部已选商品吗？'); //弹出提示框要求再次确认
      if (conf) { //若选择确定
        for (i = 0; i < tr.length; i++) { //遍历所有 tr
          var input = tr[i].getElementsByTagName('input')[0]; //选择到当前 tr 的第一个选择框
          if (input.checked) { //若判断该选择框已被选择
            tr[i].parentNode.removeChild(tr[i]); //找到该 tr 的 父节点 的 第 i 个子节点（即当前 tr ），并 remove
            i--; //由于本次循环中已选中 tr 被删除之后，其后面所有 tr 将向前移，故在下一次循环中应不改变 i 的值，以对位置改变之后的 tr 进行遍历
          }
        }
      }
    }
  };
  checkAllInput[0].checked = true; //在进入网页之后将所有商品的选择框默认已选中
  checkAllInput[0].onclick(); //执行一次全选按钮点击事件，已计算当前数目和总价

};











