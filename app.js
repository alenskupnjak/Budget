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
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensContainer:'.expenses__list'

  }



  // veza sa vanjskim svijetom, tu se sve funkcije
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
    },
    addlistItem:function(obj,type){
      let html, newHtml;
      // create HTML with placew hoker text
      if ( type === 'inc') {
        element = DOMstring.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstring.expensContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace the place holder text
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert the HTML into the doom
        let set = document.querySelector('.income__list');
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
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
    input = UICtrl.getinput();

    // 2. dodaj vrijednost na budget conntroller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);     console.log(newItem)

    // 3. dodaj vrijednost na UI
    diplay = UICtrl.addlistItem(newItem,input.type)
    
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