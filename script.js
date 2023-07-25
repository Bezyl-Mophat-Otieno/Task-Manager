//OOP IN JAVASCRIPT

class UncompletedTask{
    // Static property to hold incomplete tasks
    static tasks = [];
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
        UncompletedTask.tasks.push(this);
    }

    // Return incomplete tasks
    static getTasks() {
        return UncompletedTask.tasks;
    }
    //Delete a task from the list
    static deleteTask(task) {
        UncompletedTask.tasks = UncompletedTask.tasks.filter((t) => t.title !== task.title);
    }
    //Update a task
    static update(task) {
        const existingTask = UncompletedTask.tasks.find(t => t.title === task.title);
        if (existingTask) {
            task.isCompleted = existingTask.isCompleted; // Preserve the isCompleted state
            const index = UncompletedTask.tasks.indexOf(existingTask);
            UncompletedTask.tasks[index] = task;
        }
    }
    
    //complete a task and find the difference between the deadline and the current date
        static completeTask(task){
        const index = UncompletedTask.tasks.findIndex((t) => t.title === task.title);
        //remove this from the array of uncompleted tasks
        UncompletedTask.tasks.splice(index, 1);
        const deadline = new Date(task.deadline);
        const today = new Date();
        // get the difference between the deadline and the current date and retun the difference in hours
        const difference = Math.abs(deadline - today) / 3600000;
        // if the difference is less than 24 hours, return the difference in hours
        if(difference < 24) {
            return `${difference} hours`;
        }
        // if the difference is greater than 24 hours, return the difference in days
        
        return `${Math.floor(difference / 24)} days`;
    }

}
// a class for completed tasks 

class CompletedTask extends UncompletedTask{
    constructor(title, description, deadline) {
        super(title, description, deadline);
        this.isCompleted = true;
    }
    //Method overriding
    // modify the completeTask method to just return the difference between the deadline and the current date
        static completeTask(task){

        const deadline = new Date(task.deadline);
        const today = new Date();
        // get the difference between the deadline and the current date and retun the difference in hours
        const difference = Math.abs(deadline - today) / 36e5;
        // if the difference is less than 24 hours, return the difference in hours
        if(difference < 24) {
            return `${Math.floor(difference)} hours`;
        }
        // if the difference is greater than 24 hours, return the difference in days
        
        return `${Math.floor(difference / 24)} days`;
    }

    //    override the addTask method
       static addTask(task) {
        CompletedTask.tasks.push(task);
    }
    //Override the deleteTask method
    static deleteTask(task) {
        CompletedTask.tasks = CompletedTask.tasks.filter((t) => t.title !== task.title);
    }
    //Override the updateTask method
    static update(task) {
        const existingTask = CompletedTask.tasks.find(t => t.title === task.title);
        if (existingTask) {
            task.isCompleted = existingTask.isCompleted; // Preserve the isCompleted state
            const index = CompletedTask.tasks.indexOf(existingTask);
            CompletedTask.tasks[index] = task;
        }
    }

    

}



// Adding a task to the list
const title = document.querySelector('#title')
const description = document.querySelector('#description')
const deadline = document.querySelector('#deadline')
const addTask = document.querySelector('#addTask')
const tableBody = document.querySelector('#tableBody')
const tasksStatus = document.querySelector('#tasksStatus')
const incompleteTasksBtn = document.querySelector('#incompleteTasksBtn')
const completedTasksBtn = document.querySelector('#completedTasksBtn') 

addTask.addEventListener('click', (e) => {
    e.preventDefault()

    if(title.value === '' || description.value === '' || deadline.value === '') {
        alert('Please fill all fields')
        return;
    }
    // if you select a date in the past it should alert you
    if(new Date(deadline.value) < new Date()){

        alert('The task is overdue, please select a date in the future')
        return;
    }else{
        if(addTask.textContent == 'Add Task'){
            createTask(title,description,deadline)   
        }

        if(addTask.textContent == 'Update Task'){
            let task = {title:title.value,description:description.value,deadline:deadline.value}
            // determine which update method to call based on the status of the task
            if(addTask.getAttribute('id') == 'completedTask'){

                updateCompletedTask(task)
                addTask.textContent = 'Add Task'
                addTask.removeAttribute('id')
            }
            if(addTask.getAttribute('id') == 'uncompletedTask'){
                updateTask(task)
                addTask.textContent = 'Add Task'
                addTask.removeAttribute('id')
            }
        }
    }

})

// create a task and call the display task function 

const createTask = (title,description,deadline)=>{
    // Check if the task with the given name exists in the completed tasks and also in the incompleted tasks
    const existingTask = CompletedTask.getTasks().find((t) => t.title === title.value) || UncompletedTask.getTasks().find((t) => t.title === title.value);
    if (existingTask) {
        alert('Task with the same name already exists');
        return;
    }else{

        // Create a new task
        const task = new UncompletedTask(title.value, description.value, deadline.value);
  
        //get the incomplete tasks
        const incompleteTasks = UncompletedTask.getTasks();
        // store the tasks in the local storage
        localStorage.setItem('incompleteTasks', JSON.stringify(incompleteTasks));
        // Clear the input fields
        title.value = '';
        description.value = '';
        deadline.value = '';
        displayTasks(incompleteTasks);
    }
}

// update task function for incomplete tasks

const updateTask = (task)=>{
    UncompletedTask.update(task);
    localStorage.setItem('incompleteTasks', JSON.stringify(UncompletedTask.getTasks()));
    displayTasks(UncompletedTask.getTasks());
    title.value = '';
    title.removeAttribute('disabled');
    description.value = '';
    deadline.value = '';
}

// update tasks for completed tasks

const updateCompletedTask = (task)=>{
    CompletedTask.update(task);
    localStorage.setItem('completedTasks', JSON.stringify(CompletedTask.getTasks()));
    displayTasks(CompletedTask.getTasks());
    title.value = '';
    title.removeAttribute('disabled');
    description.value = '';
    deadline.value = '';
}

// display the tasks on the UI

const displayTasks = (tasks,status) =>{
    let tableRow = '';
    if(tasks === null || tasks.length === 0) {
        tableRow = `
        <tr>
        <td colspan="4" class="noTasks">No tasks found !</td>
        </tr>
        `;
        tableBody.innerHTML = tableRow;
    }else{

        if(status === undefined){
            
            tasks.forEach((task) => {
                tableRow += `
                <tr>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.deadline}</td>
            <div class="actions">
            <td><button class="btn-update ${task.isCompleted}" ${task.isCompleted&&"disabled"}  >Update</button></td>
            <td><button class="btn-delete ${task.isCompleted}">Delete</button></td>
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
            <td><button class=${task.isCompleted?"completed":"complete"}>${task.isCompleted?"Completed":"Complete"}</button></td>
            </div>
            </tr>
            `;
        });
        tableBody.innerHTML = tableRow;
    }
}
}


// By default fetch the tasks from the local storage and display them on the UI
const incompleteTasks = JSON.parse(localStorage.getItem('incompleteTasks'));
if(incompleteTasks) {
    UncompletedTask.tasks = incompleteTasks.filter(task=>task.isCompleted==false);
    displayTasks(incompleteTasks);
}

// Delete a task
tableBody.addEventListener('click', (e) => {

        if (e.target.classList.contains('btn-delete')) {
            const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;
    
            if (taskTitle) {
                if (e.target.classList.contains('true')) {
                    // find the task based on the task title
                    const taskToDelete = CompletedTask.getTasks().find((t) => t.title === taskTitle);
                    // Task is completed, delete from CompletedTask
                    CompletedTask.deleteTask(taskToDelete);
                    localStorage.setItem('completedTasks', JSON.stringify(CompletedTask.getTasks()));
                    displayTasks(CompletedTask.getTasks());
                            // Check if all tasks are deleted and clear local storage if true
                    if (CompletedTask.getTasks().length === 0) {
                    localStorage.removeItem('completedTasks');
                    }
                } 
                
                if(e.target.classList.contains('false')) {
                    //find the task to be deleted based on the task title
                    const taskToDelete = UncompletedTask.getTasks().find((t) => t.title === taskTitle);
                    // Task is uncompleted, delete from UncompletedTask
                    UncompletedTask.deleteTask(taskToDelete);
                    localStorage.setItem('incompleteTasks', JSON.stringify(UncompletedTask.getTasks()));
                    displayTasks(UncompletedTask.getTasks());
                    // Check if all tasks are deleted and clear local storage if true
                    if (UncompletedTask.getTasks().length === 0) {
                    localStorage.removeItem('incompleteTasks');
                    }
                }
            }


            
        }
    



        // Update a task
    if (e.target.classList.contains('btn-update')) {
        const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;

        if (taskTitle) {
            if (e.target.classList.contains('true')) {
                // Find the task to update based on the task title in the CompletedTask
                const taskToUpdate = CompletedTask.getTasks().find((t) => t.title === taskTitle);
                title.value = taskToUpdate.title;
                title.setAttribute('disabled',true);
                description.value = taskToUpdate.description;
                deadline.value = taskToUpdate.deadline;
                addTask.textContent = 'Update Task';
                // set id to distinguish between update btn for completed and that for uncompleted 
                addTask.setAttribute('id','completedTask')
                
                
            } else if (e.target.classList.contains('false')) {
                // Find the task to update based on the task title in the UncompletedTask
                const taskToUpdate = UncompletedTask.getTasks().find((t) => t.title === taskTitle);
                title.value = taskToUpdate.title;
                title.setAttribute('disabled',true);
                description.value = taskToUpdate.description;
                deadline.value = taskToUpdate.deadline;
                addTask.textContent = 'Update Task';
                // set id to distinguish between update btn for completed and that for uncompleted
                addTask.setAttribute('id','uncompletedTask')
            }
        }
    

    }
    // Complete a task 
    if(e.target.classList.contains('complete')){
        const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;
        const task = UncompletedTask.getTasks().find((t) => t.title === taskTitle);
        // complete the task 
        const difference = UncompletedTask.completeTask(task);
        // delete the task from the list of incomplete tasks
        UncompletedTask.deleteTask(task);
        localStorage.setItem('incompleteTasks', JSON.stringify(UncompletedTask.getTasks()));
        // display the difference on the UI 
        alert(`Task completed. It took you ${difference} to complete this task`);

        // create a an instance of a completed task
        const taskCompleted = new CompletedTask(task.title, task.description, task.deadline);
        // get the completed tasks and store it in the local storage ''completed tasks
        const completedTasks = CompletedTask.getTasks();
        console.log(completedTasks);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        displayTasks(CompletedTask.getTasks());
        // Check if all tasks are completed and clear local storage if true
        if (JSON.parse(localStorage.getItem('incompleteTasks')).length === 0) {
            localStorage.removeItem('incompleteTasks');
           }

    }
    // completed button is clicked alert when the task was coompleted from the difference 
    if(e.target.classList.contains('completed')){
        const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;
        const task = CompletedTask.getTasks().find((t) => t.title === taskTitle);
        const difference = CompletedTask.completeTask(task);
        alert(`Task completed. It took you ${difference} to complete this task`);
    }

});

    




//     if(e.target.classList.contains('btn-update')) {
//         const taskTitle = e.target.parentElement.parentElement.firstElementChild.textContent;
//         const task = UncompletedTask.getTasks().find((t) => t.title === taskTitle);
//         const newTitle = prompt('Enter new title', task.title);
//         const newDescription = prompt('Enter new description', task.description);
//         const newDeadline = prompt('Enter new deadline', task.deadline);
//         const newTask = new UncompletedTask(newTitle, newDescription, newDeadline);
//         UncompletedTask.update(newTask);
//         localStorage.setItem('incompleteTasks', JSON.stringify(UncompletedTask.getTasks()));
//         displayTasks(UncompletedTask.getTasks());
//     }




tasksStatus.addEventListener('click',(e)=>{
    e.preventDefault()
// get data from localstorage
const incompleteTasks = JSON.parse(localStorage.getItem('incompleteTasks'))||[];
const completedTasks = JSON.parse(localStorage.getItem('completedTasks'))||[];
const allTasks = [...incompleteTasks,...completedTasks]
displayTasks(allTasks,true);
})
incompleteTasksBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    const incompleteTasks = JSON.parse(localStorage.getItem('incompleteTasks'))||[];
    displayTasks(incompleteTasks);

})
completedTasksBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks'))||[];
    displayTasks(completedTasks);
})