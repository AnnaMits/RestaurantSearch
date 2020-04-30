var paging = 1;
var hit = 10;
var total = 0;


function onClick(){
  // 検索結果を保存するための連想配列
  var id_to_result = new Array();
  //GeolocationAPIを取得
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) { //successCallback
        var lat = position.coords.latitude; //緯度
        var lng = position.coords.longitude; //経度

        //ぐるなびAPIの取得
        //禁煙席
        //const smoking = document.form1.smoking;
        //for(let i = 0; i < smoking.length; i++) {
        //  if(smoking[i].checked){
        //    noSmoking = smoking[i].value;
        //    break;
        //  }
        //}
        //document.getElementById("span1").innerHTML = noSmoking;

        //半径
        const radius = document.range.radius;
        for(let i = 0; i < radius.length; i++) {
          if(radius[i].checked){
            choice = radius[i].value;
            break;
          }
        }
        document.getElementById("span2").innerHTML = choice;

        var url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/'
        var params = {
          keyid: 'd2159151ef3a2b210e5bf5378b5b0b9c',
          latitude: lat,
          longitude: lng,
          range: choice,
          offset_page: paging
        }
        
        var check = document.form2.check;
        for(let i = 0; i < check.length; i ++) {
          if (check[i].checked){
            params[check[i].value] = 1;
          }
        }

        /////////////////////////////
        // $("#result_list").show();  // <--  アニメーションさせない場合
        $("#result_list").fadeIn();
        //////////////////////////////

        const showResult = result => {
          total = result.total_hit_count;
          $('#result').text("");
          $("#result").append(`<p>ページ:${paging} / ${Math.ceil(total/hit)}</p>`);
          $("#result").append(`<p>該当件数:${result.total_hit_count}件</p>`);

          　

          result.rest.map( item => {
            id = item.id;
            id_to_result[id] = item;

            $("#result").append(`
              <div class="contents" id="${id}" style="padding: 10px; margin-bottom: 10px; border: 1px dashed #333333;">
                <p>${item.name}</p>
                <img src="${item.image_url.shop_image1}">
                <img src="${item.image_url.shop_image2}">
                <p>${item.address}</p>
                <p>${item.tel}</p>
                <p>${item.opentime}</p>
                <p>${item.pr.pr_short}</p>
                <a href="${item.url}">ぐるなび店舗ページへ</a>
              </div>
            `);
          });

          ////////////////////////////////////////
          // 詳細画面 div class = 'contents'をクリック
          ////////////////////////////////////////
          $('.contents').on('click', function() {
            var id =  $(this).attr("id");   // 店舗ID
            $("#result_list").fadeOut();
            $("#result_detail").fadeIn();

            item = id_to_result[id];
            $('#name').text(item.name);
            $('#shop_image1').attr("src",item.image_url.shop_image1);
            $('#shop_image2').attr("src",item.image_url.shop_image2);
            $('#address').text(item.address);
            $('#tel').text(item.tel);
            $('#opentime').text(item.opentime);
            $('#pr').text(item.pr.pr_long);
            $('#link').attr("href",item.url);
            //shop_imageというタグの中のsrcという属性にitemのimage_url.shop_imageを入れる
          });
          ////////////////////////////////////////

        }
        $.getJSON( url, params, result => {
          showResult( result );
        }).fail(function(jqXHR, textStatus, errorThrown ) {
          $("#result").text("");
          console.log(jqXHR.status);
          console.log(textStatus);
          console.log(errorThrown);
          if (jqXHR.status == 404) {
            $("#result").append(`<p>該当する結果がありません</p>`);
          };
        });
      },
      function(error) { //errorCallback
        switch(error.code) {
          case 1:
            var msg = "位置情報の利用が許可されていません";
            break;
          case 2:
            var msg = "デバイスの位置が判定できませんでした";
            break;
          case 3:
            var msg = "タイムアウトが発生しました";
            break;
        }
        $('#result').text(msg);
      }
    );
  } else {
    msg = "位置情報が取得できません";
    $('#result').text(msg);
  }
}

function onClickPrev(){
  if (paging >= 2) {
    paging -= 1;
    onClick();
    $("#result_list").hide();
    $('body, html').scrollTop(0);
    $("#result_list").fadeIn();
  }
}

function onClickNext(){
  if (paging * hit <= total ) {
    paging += 1;
    onClick();
    $("#result_list").hide();
    $('body, html').scrollTop(0);
    $("#result_list").fadeIn();
  }
}

function onClickReturn(){
  $("#result_list").fadeIn();
  $("#result_detail").fadeOut();
}
