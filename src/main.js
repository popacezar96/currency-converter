const select = document.querySelectorAll('.form-select');
const number = document.getElementById("number");
const output = document.getElementById("output");

const cadru = document.getElementById('schimbare');

const switch_btn = document.getElementById('switch-button');
const save_btn = document.getElementById('save-button');

const remove_btn = document.createElement("button");
remove_btn.textContent = 'Remove all';
// helps apply a bootstrap class that styles the remove_btn
remove_btn.setAttribute('class','btn btn-secondary poz-btn-remove');

const buttons_div= document.getElementById("buttons-div");

const left = document.querySelector('.from');
const right = document.querySelector('.to');

const tableref = document.querySelector('.table');
const tableBody = tableref.querySelector('.table-body');
const tableHead = tableref.querySelector('.table-head');


fetch('https://api.frankfurter.app/currencies').then((currencies) => currencies.json())
  .then((currencies) => {
    const entries = Object.entries(currencies);
    for (var i = 0; i < entries.length; i++) {
      select[0].innerHTML += `<option value=${entries[i][0]}>${entries[i][0]} : ${entries[i][1]}</option>`;
      select[1].innerHTML += `<option value=${entries[i][0]}>${entries[i][0]} : ${entries[i][1]}</option>`;
    }
  });

//calls the convert function when the user changes the input or selected currency
cadru.addEventListener('input', (event) => {
  convert();
});


switch_btn.onclick = function(){

  let from_currency = select[0].value;
  let to_currency = select[1].value;

  select[0].value = to_currency;
  select[1].value = from_currency;

  convert();
}

var database, idb_request;

idb_request = window.indexedDB.open("indexed-db", 1);

idb_request.addEventListener("error", function(event) {
  alert("Could not open Indexed DB due to error: " + this.errorCode);
});

idb_request.addEventListener("upgradeneeded", function(event) {

  database = this.result;
  var storage = database.createObjectStore("data", { autoIncrement: true });

});

// puts the content of the IDB inside HTML if the database is loaded successfully
idb_request.addEventListener("success", function(event) {

  database = this.result;
  var storage = database.transaction("data", "readwrite").objectStore("data");

  storage.count().addEventListener("success", function(event) {

  var nr_linii = this.result;
  //checks for information inside the IDB
  if (nr_linii > 0 ){
  //loads the content of the IDB as a big object
    storage.getAll().addEventListener("success", function(event) {
      // goes trough each object from last to first and puts each one in the HTML table
      var obContinutBD = this.result;
      let nrow, current_obj;

      for (let parc=nr_linii-1; parc>=0; parc--){

        current_obj = obContinutBD[parc];

        nrow = tableBody.insertRow();

        nrow.insertCell(0).textContent = current_obj.conversie;
        nrow.insertCell(1).textContent = current_obj.ora;
        nrow.insertCell(2).textContent = current_obj.data;
      }

      buttons_div.appendChild(remove_btn);

      tableHead.style.display = 'table-header-group';

    });
    }
  });
});

let col0, col1, col2, col_arr;
let today, time, date;
let rezultat;

let newRow, newCell;
// saves conversion, time and date in a table
save_btn.onclick = function(){

  var row_index = tableBody.rows.length;

  //displays the table header
  tableHead.style.display = 'table-header-group';

  today = new Date();
  time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

  rezultat = `${ (Number(number.value) !== 0) ? number.value : 0} ${select[0].value} = ${(Number(output.value) !== 0) ? output.value: 0} ${select[1].value}`;

  col0 = document.createTextNode(`${rezultat}`);
  col1 = document.createTextNode(`${time}`);
  col2 = document.createTextNode(`${date}`);

  col_arr = [col0, col1, col2];

  // insert rows on the first position in HTML table and push the others down
  if (row_index === 0){
    newRow = tableBody.insertRow(row_index);
  }
  else {
    newRow = tableBody.insertRow(0);
  }

  for(let i=0; i<3; i++){
    newCell = newRow.insertCell(i);
    newCell.appendChild(col_arr[i] );
  }

  // append the remove_btn if it doesn't exist already
  if (buttons_div.childElementCount < 2){
    buttons_div.appendChild(remove_btn);
  }

  // adds a new row to the IDB each time the save_btn is pressed
  var storage = database.transaction("data", "readwrite").objectStore("data");
  storage.add({ conversie: `${rezultat}`, ora: `${time}`, data:  `${date}` }, `${row_index}`);

  row_index++;
};

//removes previously saved conversions
remove_btn.onclick = function(){

  tableHead.style.display = 'none';

  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.lastChild);
  }
  buttons_div.removeChild(buttons_div.lastChild);

  //clears the content of the IDB
  var storage = database.transaction("data", "readwrite").objectStore("data");
  storage.clear();
};

// function that fetches and converts currenies with the help of FrankfurterAPI
function convert() {

  let currency1 = select[0].value;
  let currency2 = select[1].value;

  let value = number.value;

  if ((currency1 != currency2) && Number(value) !== 0) {

    const host = "api.frankfurter.app";

    fetch(`https://${host}/latest?from=${currency1}&to=${currency2}`)
      .then((val) => val.json())
      .then((val) => {

        output.value = (val.rates[currency2] * value).toFixed(3);

        // displaied value for 1 currency
        left.textContent = `1 ${currency1}`;
        right.textContent = `${val.rates[currency2]} ${currency2}`;
      })
  }
  else {
    output.value = number.value;
    if (currency1 === currency2){
      left.textContent = right.textContent =  `1 ${currency1}`;
    }
    else{
      // displaied value for 1 currency
      left.textContent =  `0 ${currency1}`;
      right.textContent = `0 ${currency2}`;
    }
  }
}
