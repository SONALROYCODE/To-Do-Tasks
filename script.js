document.addEventListener('DOMContentLoaded',()=> {
    const taskInput = document.getElementById
    ('task');
    const addTaskBtn = document.getElementById
    ('add-task');
    const taskList = document.getElementById
    ('task-list');
    const emptyImage = document.querySelector
    ('.empty-img');
    const todocontain = document.querySelector
    ('todoContainer');
    const progressBar = document.getElementById
    ('progressbar');
    const progressNumbers = document.getElementById
    ('numbers');

    const toggleEmptyState = () =>{
            emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        };

        const updateProgress = (checkCompletion = true) => {
            const totalTasks = taskList.children.length;
            const completedTasks = taskList.querySelectorAll('.checkbox:checked').length
            progressBar.style.width = totalTasks ? 
            `${(completedTasks / totalTasks) 
                *100}%` : '0%';
                progressNumbers.textContent = `
                ${completedTasks} / ${totalTasks}`;
                if(checkCompletion && totalTasks > 0 && 
                    completedTasks === totalTasks) {
                        for(i=0 ; i<10 ;  i++){
                            confetti();         
                        
                        }}
        }

        const saveTaskToLocalStorage = ()=>{
            const tasks = [...document.querySelectorAll('li')].map(lis => {
                return {
                text:  lis.querySelector('span').textContent, 
                completed: lis.querySelector('.checkbox').checked
            }});
            console.log(tasks);
            localStorage.setItem("tasks", JSON.stringify(tasks));

        };

        const loadTasksFromLocalStorage = ()=> {
            const savedTasks = [...JSON.parse(localStorage.getItem('tasks'))] || [];
            savedTasks.forEach(({ text, completed}) => addTask(text, completed, false));
            toggleEmptyState();
            updateProgress();
        }

        const addTask = (text, completed = false,
            checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText ) {
             return;
        };
            const lis = document.createElement("li");
            lis.innerHTML = ` 
            <input type="checkbox" class ="checkbox" ${completed ?'checked': '' }/>
             
            <span>${taskText}</span>

            <div class = "edit-btns">
            <button class = "edit"><i class = "fa-solid fa-pen"></i></button>
            <button class = "delete"><i class = " fa-solid fa-trash"></i></button>
            </div>
            `;

            const checkbox = lis.querySelector
            ('.checkbox');
            const editBtn = lis.querySelector
            ('.edit');

            if(completed) {
                lis.classList.add('completed');
                editBtn.disabled = true;
                editBtn.style.opacity = '0.5';
                editBtn.style.pointerEvents = 'none';
            };

            checkbox.addEventListener('change', () => {
                const isChecked = checkbox.checked;
                lis.classList.toggle('completed',isChecked);
                editBtn.disabled = isChecked;
                editBtn.style.opacity = isChecked ? '0.5' : '1';
                editBtn.style.pointEvents = isChecked ? 'none' : 'auto';
                updateProgress();
                saveTaskToLocalStorage();
            });

            editBtn.addEventListener('click', () => {
                if(!checkbox.checked) {
                    taskInput.value = lis.querySelector('span').textContent;
                    lis.remove();
                    toggleEmptyState();
                    updateProgress(false);
                    saveTaskToLocalStorage();
                }
            });

            lis.querySelector('.delete').addEventListener('click',() => {
                lis.remove();
                toggleEmptyState();
                updateProgress();
                saveTaskToLocalStorage();
            });

            taskList.prepend(lis);
            taskInput.value = '';
            toggleEmptyState ();
            updateProgress(checkCompletion);
            saveTaskToLocalStorage();
    };

    addTaskBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addTask(taskInput.value);
    });
    taskInput.addEventListener('keypress', (e) => {
        if (e.key ==='Enter') {
            e.preventDefault();
             addTask(taskInput.value);
        }
    });

    loadTasksFromLocalStorage();
});
