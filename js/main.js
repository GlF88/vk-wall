var imgMin = []; // Пустые массивы для путей к фото
var imgMax = []; // Пустые массивы для путей к фото
var likesArr = []; // Пустые массивы для информации к фото
var commentsArr = []; // Пустые массивы для информации к фото
var dateArr = []; // Пустые массивы для информации к фото

function getPhoto () {
  $.ajax({
      url : req,
      type : "GET",
      dataType : "jsonp",
      success : function(data){
        registrationImgInArray (data);
      }
  }); 
}

var thisIndexImg;

$(document).delegate( ".minImgClass", "click", function() { // функция, которая срабатывает при нажатии на фото, точнее открывается модальное окно
   thisIndexImg = $(this).index();
   $("#opacBlock").css({"display": "block"});   
   $("#imgBlock").css("transform", "scale(1)");
   $("#imgBlock img").attr("src", "" + imgMax[thisIndexImg] + "");
   $("#likes").text(likesArr[thisIndexImg]);
   $("#comments").text(commentsArr[thisIndexImg]);
   calculationDate();
   correctDisplayPhoto ();
});

  function noneModalAlert () {
    $("#imgBlock").css("transform", "scale(0)");
    $("#opacBlock").css({"display": "none"}); 
  } 

$("#opacBlock").click(function () { // тут скрываем модальное окно при нажатии на затемненый фон вызвав функцию выше
  noneModalAlert ();
});

function prevPhoto () { // функция которая листает фотки, назад
  if (thisIndexImg <= 0) {
    $("#imgBlock img").attr("src", "" + imgMax[thisIndexImg] + "");
    $("#likes").text(likesArr[thisIndexImg]);
    $("#comments").text(commentsArr[thisIndexImg]);
  } else {
    thisIndexImg--;
    $("#imgBlock img").attr("src", "" + imgMax[thisIndexImg] + "");
    $("#likes").text(likesArr[thisIndexImg]);
    $("#comments").text(commentsArr[thisIndexImg]);
    calculationDate();
    correctDisplayPhoto ();
  }
} 

function nextPhoto () { // функция которая листает фотки, в перед 
  if (thisIndexImg >= 50) {
    $("#imgBlock img").attr("src", "" + imgMax[thisIndexImg] + "");
    $("#likes").text(likesArr[thisIndexImg]);
    $("#comments").text(commentsArr[thisIndexImg]);
  } else {
    thisIndexImg++;
    $("#imgBlock img").attr("src", "" + imgMax[thisIndexImg] + "");
    $("#likes").text(likesArr[thisIndexImg]);
    $("#comments").text(commentsArr[thisIndexImg]);
    calculationDate();
    correctDisplayPhoto ();
  }
}

$("#prevPhoto").click(function () {prevPhoto ();})
$("#nextPhoto").click(function () {nextPhoto ();})


function keyCode(event) { // тут скрываем модальное окно и листаем фото с помощью клавиш 
    var key = event.keyCode;
    if (key == 27) {
        noneModalAlert ();
    };
    if (key == 37) {
      prevPhoto ();
    } 
    if (key == 39) {
      nextPhoto ();
    } 
}

function registrationImgInArray (data) { // Записываем пути к фото в массивы
    for (var i = 0; i <= 50; i++) {
      imgMin[i] = data.response[i].src;
      imgMax[i] = data.response[i].src_big; 
      likesArr[i] = data.response[i].likes.count; 
      commentsArr[i] = data.response[i].comments.count; 
      dateArr[i] = data.response[i].created;
    }
}

function createImgInContainer () { // тут я пытался сделать на нативном js, но ребят простите, у меня чуть руки не отсохли :)
  var containerImg = document.getElementById("container"); // узнаем id контейнера с фото
      if (!imgMin[0]) {
        $("#container").text("There is no picture or an incorrect user id");
      }
    for (var i = 0; i <= 50; i++) {
      if (imgMin[i]) {
        var createImg = document.createElement("img"); // генерируем тэг
        createImg.setAttribute("src", imgMin[i]); // даем атрибут src и всатвляем путь
        createImg.setAttribute("class", "minImgClass"); // присваеваем класс картинке 
        containerImg.appendChild(createImg); // вставляем тэг в контейнер 
      } else {}
    }
}

function calculationDate () { // функция которая вычисляет дату, дата от вк приходит в секундах от 1 января 1970 года...
  var sourceDate = dateArr[thisIndexImg];
  var processedDate = new Date(+sourceDate * 1000);
  $("#date").text(processedDate.toLocaleDateString());
}

function getValueInput (createImg) { // принимаем id в input и удаляем старые фото
  $("#container").empty(); // удаляем все из котенера
  $(".minImgClass").remove(); // удаляем все старые фотографии
  imgMin.length = 0;  // очищаем массивы
  imgMax.length = 0; // очищаем массивы
  var valueInput = document.getElementById("searchInput").value; // берем  значение из инпута

  var request = "https://api.vk.com/method/users.get?user_ids=" + valueInput + ""; // вставляем значение в строку

  $.ajax({ // аякс запрос...
      url : request,
      type : "GET",
      dataType : "jsonp",
      success : function(data){
        valueInput = data.response[0].uid; // берем id пользователя 
        req = "https://api.vk.com/method/photos.get?owner_id=" + valueInput + "&album_id=wall&count=51&extended=1"; // вставляем id пользователя в строку
        getPhoto (); //вызываем функцию которая тащит фотки
        setTimeout(function () {createImgInContainer ()}, 500); // через сеттаймаут вызываем функцию которая плодит фотки в div
      }
  }); 
}

function correctDisplayPhoto () { // эта функция делает так, что бы фото не вылазили за приделы модального окна
  var heightImgBlock = $("#imgBlock").height();
  var heightImg = $("#imgBlock img").height();
  if (heightImg > heightImgBlock) {
    $("#imgBlock img").css({"transform": "scale(0.8)"});
  }
}