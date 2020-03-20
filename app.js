// BUDŽET KONTROLER, protok podataka
let budgetController = (function(){

  let Expense = function(id, description, value) {
    this.id= id;
    this.description = description;
    this.value = value;
  }

  let Income = function(id, description, value) {
    this.id= id;
    this.description = description;
    this.value = value;
  }

  // definicija strukture mojih podataka
  data = { allItems:{ exp:[] ,  inc:[] },  totals:{ exp:0 , inc:0}};

// veza sa vanjskim svijetom
return {
  addItem: function(type, des, val){
    let newItem, ID;

    // kreiram novi ID
    ID = data.allItems[type].length;

    // kreiram novi item ovisno dali je 'inc' ili 'exp' i pohranjujem u data
    if (type === 'exp') {
      newItem = new Expense(ID, des,val);
      data.allItems.exp.push(newItem); console.log(data)

    } else if (type === 'inc') {
      newItem = new Income(ID, des, val);
      data.allItems.inc.push(newItem); console.log(data)
    }

    // Vracam vrijednost podatka
    return newItem;
  }

}

})();





// UI CONTROLER
let UIController = (function(){

  let DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }



  // veza sa vanjskim svijetom
  return {
    getinput: function(){
      return {
        type: document.querySelector(DOMstring.inputType).value, // odabir + ili -
        description: document.querySelector(DOMstring.inputDescription).value,
        value: document.querySelector(DOMstring.inputValue).value
      }
    },
    getDOMstrings: function(){
      return DOMstring;
    }
  }
})();



// GLAVNA KONZOLA ZA UPRAVLJANJU
let controller = (function(budgetCtrl, UICtrl) {

  let setupEventLiseners = function() {
    let DOM = UICtrl.getDOMstrings();

    let a = document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13) {
       ctrlAddItem();
      }
    });
  };


  let ctrlAddItem = function() {
    let input, newItem;

    // 1. Očitaj uneseni podatak
    let input = UICtrl.getinput();

    // 2. dodaj vrijednost na budget conntroller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    console.log(item)

    // 3. dodaj vrijednost na UI
    // 4. izračunaj budget
    // 5. Ispisati budget na UI 
  }

  // veza sa vanjskim svijetom
  return {
    init: function() {
      console.log('Aplikacija je startala!')
      setupEventLiseners();


    }
  };

})(budgetController, UIController);


// ovdje pokrecemo program
controller.init();