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
  data = { 
    allItems:{
       exp:[] ,  
       inc:[] 
      },  
       totals:{ 
         exp:0 , 
         inc:0
      }, 
      budget:0,
      percentage:0};

  let calculateTotal = function(type){
    let sum= 0;
    data.allItems[type].forEach( data=> {
      sum  += data.value;
    })
    // spremljeno kompletan
    data.totals[type]= sum;
  }

  return {
      // veza sa vanjskim svijetom
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
    },

    // izračuni
    calculateBudget: function(){
      // calculate total income and expenses
       calculateTotal('exp');
       calculateTotal('inc');
    
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp ;

      // calculate perventage
      if (data.totals.inc > 0) {
        data.percentage =  Math.round(data.totals.exp / data.totals.inc *100) ;
      } else {
        data.percentage = 0 ;
      }
    },

    // nakon rekalkulacije, vračamo izračunate vrijednosti
    getBudget: function() {
      return  {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    }
  }
})();





// UI CONTROLER **********************************************************
let UIController = (function(){

  let DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensContainer:'.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    parcentageLabel: '.budget__expenses--percentage'

  }



 
  return {
    // očitavanje vrijednosti funkcije
    getinput: function(){
      return {
        type: document.querySelector(DOMstring.inputType).value, // odabir + ili -
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value)
      }
    },
    getDOMstrings: function(){
      return DOMstring;
    },

    // ispisivanje vrijednost budgeta na ekran
    displayBudget(obj){
      document.querySelector(DOMstring.budgetLabel).textContent= obj.budget;
      document.querySelector(DOMstring.incomeLabel).textContent= obj.totalInc;
      document.querySelector(DOMstring.expenseLabel).textContent= obj.totalExp;
      if (obj.percentage > 0){
        document.querySelector(DOMstring.parcentageLabel).textContent= obj.percentage +'%';
      } else {
        document.querySelector(DOMstring.parcentageLabel).textContent='--';
      }
    },

    // setiranje vrijednosti sučelja
    cleraFields: function(){
      // vracanje na pocetnu vrijednost
      let clear = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue)
      console.log(clear)
      // Ciscenje polja pocetnih vrijednosti
      clear[0].value=""; clear[1].value=""
      // fokusiranje na opisno polje
      clear[0].focus();
    },

    // kreiramo novi trošak na sučelje ekrana
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
    // očitavanje vrijednosti
    let DOM = UICtrl.getDOMstrings();

    // regiram na potvrdu unosa(kvacica)
    let a = document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    // regiram na enter (event.which je za starije browsere)
    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13) {
       ctrlAddItem();
      }
    });
  };

  let updateBudget = function() {
    // 1. izračunaj budget
    budgetCtrl.calculateBudget();
  
    // 2. return the budget
    let budget = budgetCtrl.getBudget();

    // 3. Ispisati budget na UI 
    UICtrl.displayBudget(budget);
  }


  let ctrlAddItem = function() {
    let input, newItem;

    // 1. Očitaj uneseni podatak
    input = UICtrl.getinput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
        // 2. dodaj vrijednost na budget conntroller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);     console.log(newItem)
  
        // 3. dodaj vrijednost na UI
        diplay = UICtrl.addlistItem(newItem,input.type)
        UICtrl.cleraFields();
  
        // 4. Calculate an update the budget
        updateBudget();
    }

  }


  return {
    init: function() {
      console.log('Aplikacija je startala!');
      // setiranje ulaznih podataka na 0
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      setupEventLiseners();

    }
  };

})(budgetController, UIController);


// pokrecemo program
controller.init();