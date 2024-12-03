let addTodo = document.getElementById("addtodo");
let todoContainer = document.getElementById("todocontainer");
let inputField = document.getElementById("input-field");
let todos = JSON.parse(localStorage.getItem("todos")) || [];


 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

 const firebaseConfig = {
   apiKey: "AIzaSyAId9QHxi3kFtbEJ9ZhUyHfumthNKb1CHc",
   authDomain: "chowback-7448d.firebaseapp.com",
  projectId: "chowback-7448d",
   storageBucket: "chowback-7448d.appspot.com",
   messagingSenderId: "307580964473",
   appId: "1:307580964473:web:ce88a9b5efb456136ccea8",
   measurementId: "G-7BTHLM1G8J"
 };
 const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
//  const db = getFirestore(app); 
const db = getFirestore(app);

const timetable = {
    "Monday": {
      "breakfast": "Oat served with milk and scrambled eggs",
      "snack": "An Apple",
      "lunch": "White rice with turkey stew",
      "dinner": "Catfish pepper soup",
    },
    "Tuesday": {
      "breakfast": "Indomie cooked with fresh pepper and boiled eggs",
      "snack": "Crackers",
      "lunch": "beans with plantain and goat meat",
      "dinner": "Garri with groundnut",
      
    },
    "Wednesday": {
      "breakfast": "Acha pudding with milk and scrambled eggs",
      "snack": "Smoothie banana, apple, dates and lettuce",
      "lunch": "Spagetti cooked with palm oil and grilled fish",
      "dinner": "Greek yoghurt and fruits",
      
    },
    "Thursday": {
        "breakfast": "Toasted slice bread with sunny side up and jasmine tea",
        "snack": "An Apple",
        "lunch": "Eba with vegetable soup and goat meat",
        "dinner": "Pancake",
       
      },
      "Friday": {
        "breakfast": "beans cooked with dry fish and bread",
        "snack": "Crackers",
        "lunch": "Yam porridge with acha and vegetable",
        "dinner": "Grilled fish",
       
      },
      "Saturday": {
        "breakfast": "Boiled yam with egg sauce",
        "snack": "pineapple",
        "lunch": "Amala with okra soup and chicken",
        "dinner": "Greek yoghurt and fruits",
       
      },
      "Sunday": {
        "breakfast": "Roasted plantain with grilled croaker fish",
        "snack": "Smoothie banana, apple and avocado",
        "lunch": "EAT OUT.",
        "dinner": "Pancake",
        
      },
  };

  document.getElementById("sendMeal").addEventListener("click", function() {
    const selectedDay = document.getElementById("day").value;
    const selectedMealType = document.getElementById("meal").value;
    const meal = getMeal(selectedDay, selectedMealType);
    document.getElementById("result").textContent = `For ${selectedDay}, ${selectedMealType} is ${meal}.`;
  });
 
 document.getElementById("sendShoppingList").addEventListener("click", function () {
 //getSelectedShoppingList();
  displayShoppingList()
  showList()
});

function getMeal(day, mealType) {
  const selectedDay = timetable[day];
  if (selectedDay && selectedDay[mealType]) {
    return selectedDay[mealType];
  } else {
    return "No meal found for the given day and meal type.";
  }
}

let listz = document.getElementById("shop-items")

sendShoppingList.addEventListener("click", function() {
  showList()
} )

function showList(){
  listz.style.display = "block";
  displayShoppingList()
  displayTodos();
}

function displayShoppingList() {
  const shoppingListResultElement = document.getElementById("shoppinglistresult");
  addCheckboxListeners();
  loadAndAddCheckboxListeners();
  addCheckboxListeners()
  db.collection("shoppingLists")
    .doc("items")
    .get()
    .then(function(doc) {
      const shoppingList = doc.data()?.items || [];

      if (shoppingList.length > 0) {
        const shoppingListItems = shoppingList.map(item => `<label><input class="myCheckbox" type="checkbox" data-checkbox-id="${item}">${item}</label><br>`).join("");
        shoppingListResultElement.innerHTML = shoppingListItems;


        // Get a reference to all checkboxes with class "myCheckbox"
const checkboxes = document.querySelectorAll('.myCheckbox');

// Add event listeners to each checkbox
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const checkboxId = checkbox.dataset.checkboxId;
    const isChecked = checkbox.checked;

    // Update the checkbox state in Firestore
    db.collection("shoppingLists").doc("items").update({
      [`items.${checkboxId}.completed`]: isChecked
    })
    .then(() => {
      console.log("Checkbox state updated in Firestore!");
    })
    .catch((error) => {
      console.error("Error updating checkbox state in Firestore: ", error);
    });

    // Update the checkbox state in local storage
    updateCheckboxState(checkboxId, isChecked);

    // Optionally, update the UI or perform any other desired actions
  });
});

// Function to update the checkbox state in local storage
function updateCheckboxState(checkboxId, isChecked) {
  const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const updatedTodos = storedTodos.map(todo => {
    if (todo.id === checkboxId) {
      return { ...todo, completed: isChecked };
    }
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}  
  } 
 })  
}

function saveCheckboxState(checkboxId, isChecked) {
  localStorage.setItem(checkboxId, isChecked);
}
function loadCheckboxState(checkboxId, checkboxElement) {
  const savedState = localStorage.getItem(checkboxId);
  if (savedState !== null) {
    checkboxElement.checked = JSON.parse(savedState);
  }
}
addTodo.addEventListener("click", function () {
  if (inputField.value.trim() === "") {
    return;
  }

  let todo = {
    text: inputField.value,
    completed: false
  };

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));


  displayTodos();

  const newIndex = todos.length - 1;
  const newParagraph = todoContainer.children[newIndex];
  const newSpan = newParagraph.querySelector("span");
  attachTodoEventListeners(newParagraph, newSpan, newIndex);
});
displayTodos();
function displayTodos() {
  todoContainer.innerHTML = "";

  todos.forEach((todo, index) => {
    const paragraph = document.createElement("p");
    paragraph.classList.add("paragraph-styling");
    paragraph.innerText = todo.text;

    if (todo.completed) {
      paragraph.classList.add("completed");
    }

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    paragraph.appendChild(span);
    span.style.textDecoration = 'none';


    // Attach event listeners immediately after creating the elements
    attachTodoEventListeners(paragraph, span, index);

    todoContainer.appendChild(paragraph);
  });

  inputField.value = "";
}

// Function to attach event listeners to the paragraph and span
function attachTodoEventListeners(paragraph, span, index) {
  paragraph.addEventListener("click", function () {
    todos[index].completed = !todos[index].completed;
    localStorage.setItem("todos", JSON.stringify(todos));
    updateTodoStateInFirestore(todos[index]);
    resetParagraphStyles(); // Remove this line
    displayTodos();
  });
  
  span.addEventListener("click", function (event) {
    event.stopPropagation();
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    db.collection("todos")
      .doc(index.toString()) // Use the index as the document ID
      .delete()
      .then(function() {
        console.log("Todo deleted from Firestore!");
        syncTodosWithFirestore();
      })
      .catch(function(error) {
        console.error("Error deleting todo: ", error);
      });
    // Resetting the paragraph styles here will cause the issue
    // resetParagraphStyles();
    displayTodos();
  });
  
  // ... (existing code)  
}

 // Merge local todos and Firestore todos
 function mergeTodos(localTodos, firestoreTodos) {
  const mergedTodos = [];

  // Iterate through local todos
  for (const localTodo of localTodos) {
    // Find corresponding Firestore todo
    const firestoreTodo = firestoreTodos.find(t => t.text === localTodo.text);

    if (firestoreTodo) {
      // Merge the completed state from Firestore
      localTodo.completed = firestoreTodo.completed;
    }

    mergedTodos.push(localTodo);
  }

  return mergedTodos;
 }

 // Attach the synchronization function to the "addTodo" event
 addTodo.addEventListener("click", function () {
  if (inputField.value.trim() === "") {
    return;
  }

  let todo = {
    text: inputField.value,
    completed: false
  };
 syncTodosWithFirestore();
  todos.push(todo);

  // Save to Firestore
  db.collection("todos").add(todo)
    .then(function(docRef) {
      console.log("Todo added with ID: ", docRef.id);
      syncTodosWithFirestore(); // Synchronize todos after adding
    })
    .catch(function(error) {
      console.error("Error adding todo: ", error);
    });
  // Update local storage
  localStorage.setItem("todos", JSON.stringify(todos));
  displayTodos();
 });
 syncTodosWithFirestore();

displayTodos();
function syncTodosWithFirestore() {
  db.collection("todos")
    .get()
    .then(function(querySnapshot) {
      const firestoreTodos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Merge Firestore todos with local todos
      todos = mergeTodos(todos, firestoreTodos);

      // Display updated todos
      displayTodos();
    })
    .catch(function(error) {
      console.error("Error getting todos:", error);
    });
  }
function resetParagraphStyles() {
  const paragraphs = todoContainer.querySelectorAll(".paragraph-styling");
  paragraphs.forEach(paragraph => {
    paragraph.style.textDecoration = "none";
  });
}



function addCheckboxListeners() {
  const checkboxes = document.querySelectorAll('.myCheckbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const checkboxId = checkbox.dataset.checkboxId;
      const isChecked = checkbox.checked;

      // Update the checkbox state in Firestore
      db.collection("shoppingLists").doc("items").update({
        [`items.${checkboxId}.completed`]: isChecked
      })
      .then(() => {
        console.log("Checkbox state updated in Firestore!");
      })
      .catch((error) => {
        console.error("Error updating checkbox state in Firestore: ", error);
      });

      // Update the checkbox state in local storage
      updateCheckboxState(checkboxId, isChecked);

      // Optionally, update the UI or perform any other desired actions
    });
  });
}
function loadAndAddCheckboxListeners() {
  const checkboxes = document.querySelectorAll('.myCheckbox');
  checkboxes.forEach(checkbox => {
    const checkboxId = checkbox.dataset.checkboxId;
    loadCheckboxState(checkboxId, checkbox);
  });
  addCheckboxListeners();
}

// ... (existing code)

// Call the function to load checkbox states and add listeners
loadAndAddCheckboxListeners();