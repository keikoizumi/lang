//グローバル変数
var items = [];
var tUrl = 'http://localhost:8082/';
var all = 'all';
var sflag = 0;

function today() {
  var d = new Date();
  var formatted = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  return formatted;
}

function scraping() {  
  $(function(){
    var targetUrl = tUrl+'scraping';
      $.ajax({
          url: targetUrl,
          type: 'POST',
          scriptCharset: 'utf-8',
      }).done(function(data){ 
          $('#table').empty();
          $('#iimg').empty();
          if (data == 'True') {
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FFFF00;font-size:xx-large ;font-weight: 700;">FINISH</div></td></tr>');
            var pastDate = null; 
            data(all,pastDate);
          } else {
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          }
          sflag = 0;
          getPastDay();
        }).fail(function(data, XMLHttpRequest, textStatus) {
          $('#table').empty();
          $('#iimg').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          alert('通信失敗');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

function data(data,pastDate) {

  var targetUrl = tUrl+'data';
  var pastDate = null;

/*
  if (pastDate == null || pastDate == '') {
    date = today();  
  } else {
    date = pastDate;
  }
*/

  if (date = null) {
    if (data == all) {
      var request = {
          'date' : '',
          'data': all
      };
    }
  } 

  $(function() {
      $.ajax({
          url: targetUrl,
          type: 'POST',
          contentType: 'application/JSON',
          dataType: 'JSON',
          data : JSON.stringify(request),
          scriptCharset: 'utf-8',
      }).done(function(data) { 
          if (data == null || data == '' || data[0] == '') {
            $('#table').empty();
            $('#iimg').empty();
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
          } else {
            console.log(data);
            show(data); 
          }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          alert('通信失敗');

          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

function getPastDay() {  
  $(function(){
    var targetUrl = tUrl+'getPastDay';    
      $.ajax({
          url: targetUrl,
          type: 'POST',
          contentType: 'application/JSON',
          dataType: 'JSON',
          data : null,
          scriptCharset: 'utf-8',
      }).done(function(data) { 
          if (data == null || data == '' || data[0] == '') {
            $('#table').empty();
            $('#iimg').empty();
            $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">NO DATA</div></td></tr>');
          } else {
            $("#ddmenu").append('<option value="">PAST DATA</option>');
            for (var i = 0; i < data.length; i++) {
              $("#ddmenu").append('<option value="'+data[i].dt+'"style="font-weight: 600;" >'+data[i].dt+'</option>');
            }
          }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          alert('通信失敗');
          window.location.reload();
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

window.onload = function() {
  //today
  var pastDate = null; 
  data(all,pastDate);
  //getPastDay();
}

//scraping
$(function(){ 
  $('#start').on('click',function(){
    if (sflag == 0) {
      sflag = 1;
      scraping();
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    } else {
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING NOW ( PLEASE WAIT A MINUTE )　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    }  
  });
});

//TODAY
$(function() {
  $('.data').on('click',function() {
    var id = $(this).attr('id');
    var pastDate = null;
    if (id == all) {
      data(all,pastDate);
    } 
  });
});

//プルダウン選択時
$(function() {
  $('#ddmenu').on('click',function() {
    var pastDate = $("#ddmenu").val();
    data(all,pastDate);
  });
});

$(function() {
  $('.reset').on('click',function() {
    window.location.reload();
  });
});

function show(data) {
  $(function() {
    var dirDay = today();
    var dirNaeme = dirDay.replace( /-/g , "" );
    $('#table').empty();
    $('#iimg').empty();
    
    for (var i = 0; i < data.length; i++) {
      var id = i+1;
      $('#table').append('<tr><td>'+data[i].title+'<br><button type="button" class="btn btn-outline-primary">'+data[i].q1+'</button></br><button type="button" class="btn btn-outline-primary">'+data[i].q2+'</button><br><button type="button" class="btn btn-outline-primary">'+data[i].q3+'</button><br><button type="button" class="btn btn-outline-primary">'+data[i].ans+'</button></td></tr>');
    }  
  });
}