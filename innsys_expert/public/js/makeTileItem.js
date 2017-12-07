 function changePage(index, bMyPage) {
     // $(document).on('click', '#innsys_title', function (e) {
     var dataInfo = {
         id: null,
         result: null
     }

     var postData = {
         pageIdx: index
     }

     var callUrl = '/process/logic/getRequestCounsels';
     if (bMyPage == true) {
         callUrl = '/process/mypage/getRequestCounsels'
     }

     //encodeURI 작업이 필요할 수 있음
     $.ajax({
         type: 'post',
         dataType: 'json',
         url: callUrl,
         data: postData,
         cache: false,
         async: true,
         success: function (result) {
             //dataList = JSON.stringify(result);
             // alert(dataList);

             dataInfo.result = JSON.stringify(result.summaryRequestCounselItems);
             //alert(dataInfo.result);

             ajaxEx.parseJSON(result.summaryRequestCounselItems)
         },
         error: function (request, error) {
             alert("실패!!!(makeTileItems:1)");
         }
     });
     ///////////////////////////////////////////////////////

     var ajaxEx = {
         parseJSON: function (result) {
             var keyArray = [];
             console.log('---------------------Parse Counsel Items(begin)-----------------------');
             console.log(result);
             console.log('----------------------Parse Counsel Items(end)----------------------');
             $('#main_body').empty();
             var dataList = "";
             //alert("여기여기\n" + data);

             //key 추출 : 지금 필요 없음
             // for (var i = 0; i < data.length; i++) {
             //     for (var key in data[i]) {
             //         if (keyArray.indexOf(key) == -1) {
             //             keyArray.push(key);
             //             console.log("KeyArray:  " + key);
             //         }
             //     }
             // }

             var columnPerRow = 3;
             $(result).each(function (i, item) {
                 //create row
                 if (i % columnPerRow == 0) {
                     // if (i / columnPerRow > 0) {
                     //     dataList += "</div>";
                     // }

                     dataList += '<div class="row">';
                     console.log("나머지 연산:" + i % 3);
                 }


                 dataList += '<div id="tile_item" class="col-md-4 portfolio-item" ';
                 dataList += 'data-id=' + item.id + '>';
                 //dataList += '<div id="tile_item_id">777</div>';
                 //dataList += '<img class="img-responsive" style="max-height: 10%; width:auto"';
                 dataList += '<img class="img-responsive"';
                 dataList += ' src=';
                 dataList += checkImage(item.img_thumbnail_path);
                 dataList += ' alt=' + item.title + '>';
                 dataList += '<h4 style="font-weight: bold" class="ellipsis">' + checkValidData(item
                         .title) +
                     '</h4>';
                 dataList += '<table id="id_left">';
                 dataList += '<tr>';
                 dataList += '<td id="id_gubun">측정부위</td>';
                 dataList += '<td id="id_gubun_data">' + checkValidData(item.measure_part) + '</td>';
                 dataList += '</tr>';
                 dataList += '<tr>';
                 dataList += '<td id="id_gubun">별명</td>';
                 dataList += '<td id="id_gubun_data">' + checkValidData(item.nickname) + '</td>';
                 dataList += '</tr>';
                 dataList += '</table>';
                 dataList += '<table id="id_right">';
                 dataList += '<tr>';
                 dataList += '<td id="id_gubun">날짜</td>';
                 dataList += '<td id="id_gubun_data">' + checkValidData(item.created_at) + '</td>';
                 dataList += '</tr>';
                 dataList += '<tr>';
                 dataList += '<td id="id_gubun">자문수</td>';
                 dataList += '<td id="id_gubun_data">' + '100' + '</td>';
                 dataList += '</tr>';
                 dataList += '</table>';
                 dataList += '</div>';
                 //
                 if (i % columnPerRow == columnPerRow - 1 || i == result.length - 1) {
                     dataList += "</div>";
                 }
             });

             $('#main_body').html(dataList);
             $('#id_current_page').val(index);
         }
     }
 }

 function changePage_2(index, bMyPage) {
     // $(document).on('click', '#innsys_title', function (e) {
     var dataInfo = {
         id: null,
         result: null
     }

     var postData = {
         pageIdx: index
     }

     var callUrl = '/process/logic/getRequestCounsels';
     if (bMyPage == true) {
         callUrl = '/process/mypage/getRequestCounsels'
     }

     //encodeURI 작업이 필요할 수 있음
     $.ajax({
         type: 'post',
         dataType: 'json',
         url: callUrl,
         data: postData,
         cache: false,
         async: true,
         success: function (result) {
             //dataList = JSON.stringify(result);
             // alert(dataList);

             dataInfo.result = JSON.stringify(result.summaryRequestCounselItems);
             //alert(dataInfo.result);

             ajaxEx.parseJSON(result.summaryRequestCounselItems)
         },
         error: function (request, error) {
             alert("실패!!!(makeTileItems:2)");
         }
     });
     ///////////////////////////////////////////////////////

     var ajaxEx = {
         parseJSON: function (result) {
             var keyArray = [];
             console.log('---------------------Parse Counsel Items(begin)-----------------------');
             console.log(result);
             console.log('----------------------Parse Counsel Items(end)----------------------');
             $('#main_body').empty();
             var dataList = "";

             var columnPerRow = 3;
             $(result).each(function (i, item) {
                 //create row
                 if (i % columnPerRow == 0) {
                     dataList += '<div class="row">';
                 }

                 ///////////////////////////////////
                 dataList += '<div id="tile_item" class="col-xs-18 col-sm-6 col-md-3"';
                 dataList += ' data-id=' + item.id + '>';
                 dataList += '<div class="thumbnail" id="tile_item_thumb">';
                 dataList += '<img src="';
                 dataList += getMeasurePartIcon(item.measure_part) + '">';
                 dataList += '<div class="caption">';
                 dataList += '<h4 class="ellipsis" style="text-align: center;">' + checkValidData(item.title) + '</h4>';
                 ///
                 dataList += '<div class="row" style="padding-left: 17px; padding-right: 17px;">';
                 dataList += '<span class="pull-left"><strong>COMMENTS</strong></span>';
                 dataList += '<span class="pull-right">1,000</span>';
                 dataList += '</div>';
                 dataList += '<div class="row" style="padding-left: 17px; padding-right: 17px;">';
                 dataList += '<span class="pull-left"><strong>FACIAL PART</strong></span>';
                 dataList += '<span class="pull-right">' + item.measure_part + '</span>';
                 dataList += '</div>';
                 dataList += '<div class="row" style="padding-left: 17px; padding-right: 17px; margin-bottom: 5px;">';
                 dataList += '<span class="pull-left"><strong>DATE</strong></span>';
                 dataList += '<span class="pull-right">' + getDateFormat(item.created_at) + '</span>';
                 dataList += '</div>';
                 ///
                 dataList +=
                     '<a id="tile_item_jasehi_bogi" href="javascript:void(0)" class="btn btn-primary btn-sm btn-block" role="button">자세히 보기</a>';
                 dataList += '</div>';
                 dataList += '</div>';
                 dataList += '</div>';
                 ///////////////////////////////////

                 ///////////////////////
                 //  dataList += '<div id="tile_item" class="col-md-4 col-sm-4 mb" ';
                 //  dataList += 'data-id=' + item.id + '>';
                 //  dataList += '<div class="white-panel pn">';
                 //  dataList += '<div class="white-header">';
                 //  dataList += '<h5 class="ellipsis">' + checkValidData(item.title) + '</h5>';
                 //  dataList += '</div>';
                 //  dataList += '<div class="row">';
                 //  dataList += '<div class="col-sm-6 col-xs-6 goleft">';
                 //  dataList += '<p><i class="fa fa-comment"></i> 100</p>';
                 //  dataList += '</div>';
                 //  dataList += '<div class="col-sm-6 col-xs-6"></div>';
                 //  dataList += '</div>';
                 //  dataList += '<div class="centered">';
                 //  dataList += '<img src=';
                 //  dataList += checkImage(item.img_thumbnail_path);
                 //  dataList += ' width="120"';
                 //  dataList += ' alt=' + item.title + '>';
                 //  dataList += '</div>';
                 //  dataList += '</div>';
                 //  dataList += '</div>';
                 ////////////////

                 if (i % columnPerRow == columnPerRow - 1 || i == result.length - 1) {
                     dataList += "</div>";
                 }
             });

             $('#main_body').html(dataList);
             $('#id_current_page').val(index);
         }
     }
 }