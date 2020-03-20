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


// UI CONTROLER, ispisivanje na ekran
let UIController = (function(){



})();


// GLAVNA KONZOLA ZA UPRAVLJANJU
let controller = (function(budgetCtrl, UICtrl) {

let z =budgetCtrl.publicTest(5)

return {
  anotherPublic: function() {
    console.log(z);
  }
}

})(budgetController, UIController);