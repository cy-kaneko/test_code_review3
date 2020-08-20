(function() {
  'use strict';

  /**
   * 小計が100000を超えるレコードの背景色を変更する
   * @param {object} event
   */
  function changeBackgroundColor(event) {
    var BACKGROUND_COLOR = '#ffcccc';
    var subTotalText = 'subTotal';
    var fieldSubTotal = kintone.app.getFieldElements(subTotalText);
    var i;
    var records;

    for (i = 0; i < fieldSubTotal.length; i++) {

      records = event.records[i];

      if (records[subTotalText].value > 100000) {
        // 小計の親要素の背景色を変更して、該当行全体の背景色を変更する
        fieldSubTotal[i].parentNode.style.backgroundColor = BACKGROUND_COLOR;
        // fieldSubTotal[i].style.backgroundColor = BACKGROUND_COLOR;
      }
    }
    return event;
  }

  /**
   * レコード一覧に、検索用テキストボックスとボタンを追加する
   */
  function addItems() {
    var APP_ID = kintone.app.getId();
    var button = new kintoneUIComponent.Button({text: '検索'});
    var textbox = new kintoneUIComponent.Text({value: ''});
    var client = new KintoneRestAPIClient({
      baseUrl: location.origin
    });

    if (document.getElementById('my_index_button') !== null) {
      return;
    }

    kintone.app.getHeaderMenuSpaceElement().appendChild(button.render());
    kintone.app.getHeaderMenuSpaceElement().appendChild(textbox.render());
    button.element.id = 'my_index_button';

    // textboxの右に配置
    button.element.style.float = 'right';

    // textbox に入力された文字列でレコードを検索して、検索結果を Dialog に表示する
    button.on('click', function(event) {
      var searchText;
      var body;

      if (textbox.getValue() === '') {
        window.alert('検索文字列を入力してください');
      } else {
        searchText = 'company like "' + textbox.getValue() + '"';
        searchText += ' or contact_personal like "' + textbox.getValue() + '"';
        searchText += ' order by expected_date desc';

        body = {
          app: APP_ID,
          query: searchText,
          totalCount: true
        };

        client.record
          .getRecords(body)
          .then(function(resp) {
            showSearchResut(resp);
          })
          .catch(function(error) {
            showErrorMessage(error);
          });
      }
      return event;
    });
  }

  function showDialog(content) {
    var myDialog = new kintoneUIComponent.Dialog({
      header: '検索結果',
      content: content,
      // footer: 'Footer',
      isVisible: true,
      showCloseButton: true
    });

    document.body.append(myDialog.render());
  }

  function showSearchResut(resp) {
    var records;
    var searchResult;
    var i;
    var preTag = document.createElement('pre');
    var noneMessage = '該当するレコードはありません。';
    if (resp.totalCount === '0') {
      preTag.textContent = noneMessage;
    } else {
      searchResult = '';
      for (i = 0; i < resp.records.length; i++) {
        records = resp.records[i];
        searchResult += '見込み時期：' + records.expected_date.value;
        searchResult += ' 会社名：' + records.company.value;
        searchResult += ' 先方担当者：' + records.contact_personal.value + '\n';
        preTag.textContent = searchResult;
      }
    }
    showDialog(preTag);
  }

  function showErrorMessage(error) {
    var preTag = document.createElement('pre');
    // error:エラーの場合はメッセージを表示する
    var errmsg = 'レコード検索時にエラーが発生しました。';
    // レスポンスにエラーメッセージが含まれる場合はメッセージを表示する
    if (error.message !== undefined) {
      errmsg += '\n' + error.message;
    }
    preTag.textContent = errmsg;
    showDialog(preTag);
  }

  kintone.events.on('app.record.index.show', function(event) {
    addItems();
    changeBackgroundColor(event);
    return event;
  });

})();