// Buđet kontroler
let budgetController = (function(){

let x = 23
let add = function(a){
  return x + a
}

return {
 publicTest: function(b){
  return add(b);
 }

}

})();

budgetController.publicTest(5)


// UI CONTROLER
let UIController = (function(){



})();


// GLAVNA KONZOLA ZA UPRAVLJANJU
let controller = (function(budgetCtrl, UICtrl) {

let ctrlAddItem = function() {
  console.log('evo me')
  // 1. Očitaj uneseni podatak
  // 2. dodaj vrijednost na budget conntroller
  // 3. dodaj vrijednost na UI
  // 4. izračunaj budget
  // 5. Ispisati budget na UI 
}

// Pokreče program
let a = document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

// registrira stiskanje bilo koje tipke, mi trazimo enter!
document.addEventListener('keypress', function(event){
  if (event.keyCode === 13 || event.which === 13) {
   ctrlAddItem();
  }
});



let z =budgetCtrl.publicTest(5)
return {
  anotherPublic: function() {
    console.log(z);
  }
}

})(budgetController, UIController);