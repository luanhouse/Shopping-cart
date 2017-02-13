/**
 * Created by House on 2017/1/7.
 */

window.onload = function () {

  //声明变量
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

  function getTotal() {
    var sel = 0;
    var pri = 0;
    for (i = 0; i < tr.length; i++) {
      if (tr[i].getElementsByTagName('input')[0].checked) {
        tr[i].className = 'on';
        sel += parseInt(tr[i].getElementsByTagName('input')[1].value);
        pri += parseFloat(tr[i].cells[4].innerHTML);
      }
      else {
        tr[i].className = '';
      }
    }
    selectedTotal.innerHTML = sel;
    priceTotal.innerHTML = pri.toFixed(2);
  }

  function getSubTotal(tr) {
    var tds = tr.cells;
    var price = parseFloat(tds[2].innerHTML);
    var count = parseInt(tr.getElementsByTagName('input')[1].value);
    tds[4].innerHTML = parseFloat(price * count).toFixed(2);
  }

  for (i = 0; i < checkInput.length; i++) {
    checkInput[i].onclick = function () {
      if (this.className == 'check-all check') {
        for (j = 0; j < checkInput.length; j++) {
          checkInput[j].checked = this.checked;
        }
      }
      if (this.checked == false) {
        for (k = 0; k < checkAllInput.length; k++) {
          checkAllInput[k].checked = false;
        }
      }
      getTotal();
    }
  }

  for (i = 0; i < tr.length; i++){
    tr[i].onclick = function (e) {
      var el = e.srcElement;
      var cls = el.className;
      var input = this.getElementsByTagName('input')[1];
      var val = parseInt(input.value);
      var reduce = this.getElementsByTagName('span')[1];
      var tr = this;

      switch (cls) {
        case 'add':
          input.value = val + 1;
          reduce.innerHTML = '-';
          getSubTotal(tr);
          break;
        case 'reduce':
          if (input.value > 1) {
            input.value = val - 1;
            if (input.value <= 1) {
              input.innerHTML = '1';
              reduce.innerHTML = '';
            }
          }
          getSubTotal(tr);
          break;
        case 'delete':
          var conf = confirm('确定要删除所选商品吗？');
          if (conf) {
            this.parentNode.removeChild(this);
          }
          break;
        default:
      }
      getTotal();
    };
    tr[i].getElementsByTagName('input')[1].onkeyup = function () {
      var val = parseInt(this.value);
      var tr = this.parentNode.parentNode;
      var reduce = tr.getElementsByTagName('span')[1];
      if (isNaN(val) || val <= 1) {
        val = 1;
        reduce.innerHTML = '';
      }
      else if (val > 1) {
        reduce.innerHTML = '-';
      }
      this.value = val;
      getSubTotal(tr);
      getTotal();
    }
  }

  deleteAll.onclick = function () {
    if (selectedTotal.innerHTML != 0) {
      var conf = confirm('确定要删除所有已选商品吗？');
      if (conf) {
        for (i = 0; i < tr.length; i++) {
          var input = tr[i].getElementsByTagName('input')[0];
          if (input.checked) {
            tr[i].parentNode.removeChild(tr[i]);
            i--;
          }
        }
      }
    }
  };
  checkAllInput[0].checked = true;
  checkAllInput[0].onclick();


};
















