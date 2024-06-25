      // в эту константу помещаем URL развёрнутого веб-приложения Google Apps Script
      // ВНИМАНИЕ! Это должен быть адрес ВАШЕГО РАЗВЕРНУТОГО ПРИЛОЖЕНИЯ
      // ТЕКУЩИЙ URL_APP приведён для примера
      const URL_APP =     "https://script.google.com/macros/s/AKfycbwDHxYdIwr73m4DBpDyKCQtT5egSlGBtuyxkWS-jvgiGMncQeE5FEH2DSC9FVBSCa5wnA/exec";

      // находим форму в документе
      const form = document.querySelector("#form");

      // указываем адрес отправки формы (нужно только в начале примера)
      form.action = URL_APP;

      // вспомогательная функция проверки заполненности формы
      function isFilled(details) {
        const { name, email, phone, rule } = details;
        if (!name) return false;
        if (!email) return false;
        if (!phone) return false;
        if (!rule) return false;
        return true;
      }

      // навешиваем обработчик на отправку формы
      form.addEventListener("submit", async (ev) => {
        // отменяем действие по умолчанию
        ev.preventDefault();

        // получаем ссылки на элементы формы
        const name = document.querySelector("[name=name]");
        const email = document.querySelector("[name=email]");
        const phone = document.querySelector("[name=phone]");
        const message = document.querySelector("[name=message]");
        const rule = document.querySelector("[name=rule]");

        // собираем данные из элементов формы
        let details = {
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          message: message.value.trim(),
          rule: rule.checked,
        };

        // если поля не заполнены - прекращаем обработку
        if (!isFilled(details)) return;

        // подготавливаем данные для отправки
        let formBody = [];
        for (let property in details) {
          // кодируем названия и значения параметров
          let encodedKey = encodeURIComponent(property);
          let encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        // склеиваем параметры в одну строку
        formBody = formBody.join("&");

        // выполняем отправку данных в Google Apps
        const result = await fetch(URL_APP, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          //cors: "no-cors", <- это неправильно
          mode: "cors", //<- оставим по умолчанию
          body: formBody,
        })
          .then((res) => res.json())
          .catch((err) => alert("Ошибка!"))
          // .then((res) => console.log(res));
          
         if( result.type === 'success' ) {
            name.value = '';
            email.value = '';
            phone.value = '';
            message.value = '';
           alert('Спасибо за заявку!')
         }
         if( result.type === 'error' ) {            
           alert(`Ошибка( ${result.errors}`)
         }


      });


//Код Google Apps Script

/*
//ТУТ КОД ВАШЕГО РАЗВЕРТЫВАНИЯ
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1qwro6c_Jo_6-NZQ1YxabB4VoO3taIAYLhPZuwE9NSMA/edit#gid=0';
const SHEET_NAME = "Лист1";

function doPost(e) {
  const sheets = SpreadsheetApp.openByUrl(SHEETS_URL);
  const sheet = sheets.getSheetByName(SHEET_NAME);
  const errors = [];

  let { name, email, phone, rule, message } = e.parameter;

  const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if( name.length > 20 ){
    errors.push(['name', 'попытка ввода очень длинной строки'])
  }
  if( email.length > 40 ){
    errors.push(['email', 'попытка ввода очень длинной строки'])
  }
  if( phone.length > 12 ){
    errors.push(['phone', 'попытка ввода очень длинной строки'])
  }
  if( message.length > 100 ){
    errors.push(['message', 'попытка ввода очень длинной строки'])
  }
  if( !emailRegExp.test(email) ){
    errors.push(['email', 'некорректный емейл'])
  }
  if( !rule ){
    errors.push(['rule', 'не выбран флажок согласия с обработкой данных'])
  }

  if( errors.length ){
    return ContentService
    .createTextOutput(JSON.stringify({ "type": "error", "errors": errors }))
    .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([name, email, ' ' + phone, rule, new Date().toISOString(), message.slice(0, 100)]);

  return ContentService
    .createTextOutput(JSON.stringify({ "type": "success" }))
    .setMimeType(ContentService.MimeType.JSON);

}
*/