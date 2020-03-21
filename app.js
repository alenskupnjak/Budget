// BUDŽET KONTROLER, protok podataka
let budgetController = (function(){

  let Expense = function(id, description, value) {
    this.id= id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome)*100);
    } else {
      this.percentage = -1;
    }
  }

  Expense.prototype.getPercentage = function(){
    return this.percentage;
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
    data.allItems[type].forEach( data => {
      sum  += data.value;
    })
    // spremljeno kompletan
    data.totals[type]= sum;
  }

  return {

    deleteItem: function(type, id){
        console.log( data.allItems[type])

        //  formiramo polje gdje su pospremljeni svi indexi
        ids = data.allItems[type].map(data=> {
          return data.id.toString();
        })
        console.log(ids)
        console.log(id)
        
        // pronalazimo koji je index koji nam omogucije da ga obrisemo
        index = ids.indexOf(id)
        
        console.log('index= ' + index)

        // indexOf vraca vrijednost -1 ako ne pronade vrijednost u polju
          if (index !== -1) {
            data.allItems[type].splice(index,1);
          }

        data.allItems[type].forEach(data =>{
          console.log(data);
        })


    },

    // veza sa vanjskim svijetom
    addItem: function(type, des, val){
          let newItem, ID;

          // kreiram novi ID
          // ID = data.allItems[type].length;
          ID = Math.random()

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

    // izračuni z BUDGET
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

    // Izračun postotka svake stavke EXP pojedinačno
    calculatePrecentages: function(){
        data.allItems.exp.forEach(e =>{
          e.calcPercentage(data.totals.inc);
        })
    },

    // prolazim kroz polje EXp i za svaki pojedinacno ocitavam vrijednost te ju stavljam u polje
    getPercentage: function() {
      var allPerc = data.allItems.exp.map(e =>{
        return e.getPercentage();
      })
      return allPerc
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
    parcentageLabel: '.budget__expenses--percentage',
    container: '.container'

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
    clearFields: function(){
      // vracanje na pocetnu vrijednost
      let clear = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue)

      // Ciscenje polja pocetnih vrijednosti
      // clear[0].value=""; clear[1].value=""

      // fokusiranje na opisno polje
      clear[0].focus();
    },

    // kreiramo novi trošak na sučelje ekrana
    addlistItem:function(obj,type){
      let html, newHtml;
      // create HTML with placew hoker text
      if ( type === 'inc') {
        element = DOMstring.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstring.expensContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace the place holder text
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert the HTML into the doom
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

    // postavljenje event lisenera za brisanje itema income i expense
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  };

  // brisanje utem-a sa liste 
  let ctrlDeleteItem = function(event){
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitId = itemID.split('-');
      type = splitId[0];    console.log(type)
      ID = splitId[1];     console.log(ID)
  
      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type,ID);
  
      // 2. Delete the item from the UI
      document.getElementById(itemID).remove();

      // 3. Update and show the new budget
      budgetCtrl.calculateBudget();
      let budget = budgetCtrl.getBudget();
      UICtrl.displayBudget(budget);
  
      // 4. Calculate and update percentage
      updatePercentage();
    }
  }
  


  //joijoi
  let updateBudget = function() {
    // 1. izračunaj budget
    budgetCtrl.calculateBudget();
  
    // 2. return the budget
    let budget = budgetCtrl.getBudget();

    // 3. Ispisati budget na UI 
    UICtrl.displayBudget(budget);
  }

  // updatira percentage nakon dodavanja ili brisanja itema
  let updatePercentage = function(){
    
    // 1 calculate percentages
     budgetCtrl.calculatePrecentages();

    //2. read from the budget controler
    let percentage = budgetCtrl.getPercentage();
    console.log(percentage)

    //3 Update the UI
  };


  // dodavanje nove stavke EXP ili INC
  let ctrlAddItem = function() {
    let input, newItem;

    // 1. Očitaj uneseni podatak
    input = UICtrl.getinput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
        // 2. dodaj vrijednost na budget conntroller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);     console.log(newItem)
  
        // 3. dodaj vrijednost na UI
        diplay = UICtrl.addlistItem(newItem,input.type)
        UICtrl.clearFields();
  
        // 4. Calculate an update the budget
        updateBudget();

        // 5. Calculate and update percentage
        updatePercentage();
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