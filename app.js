// BUDŽET KONTROLER, protok podataka
let budgetController = (function() {
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // definicija strukture mojih podataka
  data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: 0
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(data => {
      sum += data.value;
    });
    // spremljeno kompletan
    data.totals[type] = sum;
  };

  return {
    deleteItem: function(type, id) {
      console.log(data.allItems[type]);

      //  formiramo polje gdje su pospremljeni svi indexi
      ids = data.allItems[type].map(data => {
        return data.id.toString();
      });
      console.log(ids);
      console.log(id);

      // pronalazimo koji je index koji nam omogucije da ga obrisemo
      index = ids.indexOf(id);

      console.log('index= ' + index);

      // indexOf vraca vrijednost -1 ako ne pronade vrijednost u polju
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

      data.allItems[type].forEach(data => {
        console.log(data);
      });
    },

    // veza sa vanjskim svijetom
    addItem: function(type, des, val) {
      let newItem, ID;

      // kreiram novi ID
      // ID = data.allItems[type].length;
      ID = Math.random();

      // kreiram novi item ovisno dali je 'inc' ili 'exp' i pohranjujem u data
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
        data.allItems.exp.push(newItem);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
        data.allItems.inc.push(newItem);
      }

      // Vracam vrijednost podatka
      return newItem;
    },

    // izračuni z BUDGET
    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = 0;
      }
    },

    // Izračun postotka svake stavke EXP pojedinačno
    calculatePrecentages: function() {
      data.allItems.exp.forEach(e => {
        e.calcPercentage(data.totals.inc);
      });
    },

    // prolazim kroz polje EXp i za svaki pojedinacno ocitavam vrijednost te ju stavljam u polje
    getPercentage: function() {
      var allPerc = data.allItems.exp.map(e => {
        return e.getPercentage();
      });
      return allPerc;
    },

    // nakon rekalkulacije, vračamo izračunate vrijednosti
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

// UI CONTROLER **********************************************************
let UIController = (function() {
  let DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    parcentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  // funkcija formatiranja  brojeva
  var formatNumber = function(num, type) {
    let numSplit, int, dec;
    /*
            + or - predznak
            2 decimalna mjesta
            zarez dijeli tisućicu
            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');

    int = numSplit[0];
    dec = numSplit[1];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    type === 'inc' ? predznak = '+' : predznak = '-';
    return predznak + int + '.' + dec;
  };

  return {
    // očitavanje vrijednosti funkcije
    getinput: function() {
      return {
        type: document.querySelector(DOMstring.inputType).value, // odabir + ili -
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value)
      };
    },

    changeType: function(event){
     let fields = document.querySelectorAll(
       DOMstring.inputType + ',' +
       DOMstring.inputDescription + ',' +
       DOMstring.inputValue 
     )

    //  // rijesenje bez calback funkcije
    //    fields[0].classList.toggle('red-focus');
    //    fields[1].classList.toggle('red-focus');
    //    fields[2].classList.toggle('red-focus');

    // rijesenje callback
    var callbackFun = function(list, callback) {
      for (var i = 0; i < list.length; i++) {
          callback(list[i]);
      }
    };

    callbackFun(fields, function(cur) {
       cur.classList.toggle('red-focus'); 
    });

    document.querySelector(DOMstring.inputBtn).classList.toggle('red')
    },



    displayMonth: function(){
      let now, year, months
      now = new Date();
      year = now.getFullYear();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();

      document.querySelector(DOMstring.dateLabel).textContent = months[month] + '/' +year;
    },


    getDOMstrings: function() {
      return DOMstring;
    },


    // ispisivanje vrijednost budgeta na ekran
    displayBudget: function(obj) {
      let type;
      obj.budget > 0 ? (type = 'inc') : (type = 'exp');
      
      document.querySelector(DOMstring.budgetLabel).textContent = formatNumber( obj.budget,type);
      document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstring.parcentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMstring.parcentageLabel).textContent = '--';
      }
    },

    // postavljenje postoci pojedine EXP komponente ( svaka posebno)
    displayPercentages: function(percentages) {
      let fields = document.querySelectorAll(DOMstring.expensesPercLabel);
      fields.forEach((data, index) => {
        fields[index].textContent = percentages[index] + '%';
      });
    },

    // setiranje vrijednosti sučelja
    clearFields: function() {
      // vracanje na pocetnu vrijednost
      let clear = document.querySelectorAll(
        DOMstring.inputDescription + ',' + DOMstring.inputValue
      );


      // fokusiranje na opisno polje
      clear[0].focus();
    },

    // kreiramo novi trošak na sučelje ekrana
    addlistItem: function(obj, type) {
      let html, newHtml;
      // create HTML with placew hoker text
      if (type === 'inc') {
        element = DOMstring.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstring.expensContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the place holder text
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // insert the HTML into the doom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    }
  };
})();

// GLAVNA KONZOLA ZA UPRAVLJANJU
let controller = (function(budgetCtrl, UICtrl) {
  let setupEventLiseners = function() {
    // očitavanje vrijednosti
    let DOM = UICtrl.getDOMstrings();

    // regiram na potvrdu unosa(kvacica)
    let a = document
      .querySelector(DOM.inputBtn)
      .addEventListener('click', ctrlAddItem);

    // regiram na enter (event.which je za starije browsere)
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)

    // postavljenje event lisenera za brisanje itema income i expense
    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  // brisanje utem-a sa liste
  let ctrlDeleteItem = function(event) {
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitId = itemID.split('-');
      type = splitId[0];
      ID = splitId[1];

      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      document.getElementById(itemID).remove();

      // 3. Update and show the new budget
      budgetCtrl.calculateBudget();
      let budget = budgetCtrl.getBudget();
      UICtrl.displayBudget(budget);

      // 4. Calculate and update percentage
      updatePercentage();
    }
  };

  //joijoi
  let updateBudget = function() {
    // 1. izračunaj budget
    budgetCtrl.calculateBudget();

    // 2. return the budget
    let budget = budgetCtrl.getBudget();

    // 3. Ispisati budget na UI
    UICtrl.displayBudget(budget);
  };

  // updatira percentage nakon dodavanja ili brisanja itema
  let updatePercentage = function() {
    // 1 calculate percentages
    budgetCtrl.calculatePrecentages();

    //2. read from the budget controler
    let percentage = budgetCtrl.getPercentage();

    //3 Update the UI
    UICtrl.displayPercentages(percentage);
  };

  // dodavanje nove stavke EXP ili INC
  let ctrlAddItem = function() {
    let input, newItem;

    // 1. Očitaj uneseni podatak
    input = UICtrl.getinput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. dodaj vrijednost na budget conntroller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. dodaj vrijednost na UI
      diplay = UICtrl.addlistItem(newItem, input.type);
      UICtrl.clearFields();

      // 4. Calculate an update the budget
      updateBudget();

      // 5. Calculate and update percentage
      updatePercentage();
    }
  };

  return {
    init: function() {
      UICtrl.displayMonth();
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
