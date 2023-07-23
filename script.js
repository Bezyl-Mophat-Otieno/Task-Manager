//OOP IN JAVASCRIPT

class UncompletedTask{
    // Static property to hold incomplete tasks
    static _incompleteTasks = [];
    title;
    description;
    deadline;
    isCompleted;
    

    constructor(title, description, deadline) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.isCompleted = false;

        // Call the addTask() method to automatically add the task to the incomplete tasks list
        this.addTask();
    }

    // Add a task to the list
    addTask() {
        UncompletedTask._incompleteTasks.push(this);
    }

    // Return incomplete tasks
    static getIncompleteTasks() {
        return UncompletedTask._incompleteTasks;
    }
    //Delete a task from the list
    static deleteTask(task) {
        UncompletedTask._incompleteTasks = UncompletedTask._incompleteTasks.filter((t) => t.title !== task.title);
    }
    //Update a task
    static updateTask(task) {
        const index = UncompletedTask._incompleteTasks.findIndex((t) => t.title === task.title);
        UncompletedTask._incompleteTasks[index] = task;
        console.log(UncompletedTask._incompleteTasks);
    }

}



// Adding a task to the list
const title = document.querySelector('#title')
const description = document.querySelector('#description')
const deadline = document.querySelector('#deadline')
const addTask = document.querySelector('#addTask')
const tableBody = document.querySelector('#tableBody')
const tasksStatus = document.querySelector('#tasksStatus')

addTask.addEventListener('click', (e) => {
    e.preventDefault()

    if(title.value === '' || description.value === '' || deadline.value === '') {
        alert('Please fill all fields')
        return;
    }else{
        if(addTask.textContent == 'Add Task'){
            createTask(title,description,deadline)   
        }

        if(addTask.textContent == 'Update Task'){
            updateTask(title,description,deadline)   
            addTask.textContent = 'Add Task'
        }
    }

})

// create a task and call the display task function 

const createTask = (title,description,deadline)=>{
      // Create a new task
      const task = new UncompletedTask(title.value, description.value, deadline.value);

      //get the incomplete tasks
      const incompleteTasks = UncompletedTask.getIncompleteTasks();
      // store the tasks in the local storage
      localStorage.setItem('incompleteTasks', JSON.stringify(incompleteTasks));
      // Clear the input fields
      title.value = '';
      description.value = '';
      deadline.value = '';
      displayTasks(incompleteTasks);

}

// update task function

const updateTask = (title,description,deadline)=>{
    const task = {title:title.value,description:description.value,deadline:deadline.value}
    UncompletedTask.updateTask(task);
    localStorage.setItem('incompleteTasks', JSON.stringify(UncompletedTask.getIncompleteTasks()));
    displayTasks(UncompletedTask.getIncompleteTasks());
}

// display the tasks on the UI

const displayTasks = (tasks,status) =>{


    let tableRow = '';
    if(status === undefined){

        tasks.forEach((task) => {
            tableRow += `
            <tr>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.deadline}</td>
            <div class="actions">
            <td><button class="btn-update">Update</button></td>
            <td><button class="btn-delete">Delete</button></td>
            </div>
            </tr>
            `;
        });
        tableBody.innerHTML = tableRow;
    }else{
        tasks.forEach((task) => {
            tableRow += `
            <tr>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.deadline}</td>
            <div class="actions">
            <td><button  class=${task.isCompleted?"completed":"complete"}>${task.isCompleted?"completed":"complete"}</button></td>
            </div>
            </tr>
            `;
        });
        tableBody.innerHTML = tableRow;
    }
}

// By default fetch the tasks from the local storage and display them on the UI
const incompleteTasks = JSON.parse(localStorage.getItem('incompleteTasks'));
if(incompleteTasks) {
    UncompletedTask._incompleteTasks = incompleteTasks.filter(task=>task.isCompleted==false);
    displayTasks(incompleteTasks);
}

// Delete a task
tableBody.addEventListener('click', (e) => {

    if(e.target.classList.contains('btn-delete')) {
        const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;
        const task = UncompletedTask.getIncompleteTasks().find((t) => t.title === taskTitle);
        UncompletedTask.deleteTask(task);
        localStorage.setItem('incompleteTasks', JSON.stringify(UncompletedTask.getIncompleteTasks()));
        displayTasks(UncompletedTask.getIncompleteTasks());
    }
    if(e.target.classList.contains('btn-update')){
        const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;
        const task = UncompletedTask.getIncompleteTasks().find((t) => t.title === taskTitle);
        title.value = task.title;
        description.value = task.description;
        deadline.value = task.deadline;
        addTask.textContent = 'Update Task';
    }
//     if(e.target.classList.contains('btn-update')) {
//         const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;
//         const task = UncompletedTask.getIncompleteTasks().find((t) => t.title === taskTitle);
//         const newTitle = prompt('Enter new title', task.title);
//         const newDescription = prompt('Enter new description', task.description);
//         const newDeadline = prompt('Enter new deadline', task.deadline);
//         const newTask = new UncompletedTask(newTitle, newDescription, newDeadline);
//         UncompletedTask.updateTask(newTask);
//         localStorage.setItem('incompleteTasks', JSON.stringify(UncompletedTask.getIncompleteTasks()));
//         displayTasks(UncompletedTask.getIncompleteTasks());
//     }


})

tasksStatus.addEventListener('click',(e)=>{
// get data from localstorage
const incompleteTasks = JSON.parse(localStorage.getItem('incompleteTasks'));
displayTasks(incompleteTasks,true);
})

