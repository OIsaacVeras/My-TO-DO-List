const tasksList = JSON.parse(localStorage.getItem("DB")) ?? [{task: "Hello world!", isFinite: true}]; //Lista de tasks.
let filteredList = [];
let isSearchMode = false; //Diz se o search mode está ativado ou não.
let haveOneClick = false;
let isInEditing = false; //diz se um input esta em modo de edição


document.addEventListener("DOMContentLoaded", ()=>{
    printList();
})

function decideAddOrSearch() {
    if(isSearchMode){
        filterTasks();
    }else {
        addANewTask();
        document.getElementById("input-text").value = "";
    }
}

function addANewTask(){
    const input = document.getElementById("input-text"); //input de texto.

    if(input.value !== ""){
        const newObjectTask = {task: input.value, isFinished: false};
        tasksList.push(newObjectTask);
        localStorage.setItem("DB", JSON.stringify(tasksList));

        printList(); //Redesenha a lista depois de adicionar um novo item a ela.
    }
}

function printList () {
    const container = document.querySelector(".tasks-container");
    const inputValue = document.getElementById("input-text").value;

    let tasksHTML = "";  

    tasksList.forEach((task, index)=>{
        if (isSearchMode && inputValue !== "" && !filteredList.includes(task)) {
            return;
        }

        tasksHTML += `
            <div class="task-item-container" id="${index}">
                <div class="label ${task.isFinished ? "marked" : ""}" onclick="markATask(this)">
                    <span class="checkbox"></span>
                    <input class="no-caret" type="text" value="${task.task}" maxlength="50" readonly onclick="editATask(event)" onblur="closeEditingTask(this)">
                </div>
                <img src="images/trash-x.png" alt="trash icon" onclick="deleteTask(this)">
            </div>
        `;
    })

    container.innerHTML = tasksHTML;

}

function answerOfModal(){
    return new Promise((resolve)=>{
        const closeModal = () => {
            document.querySelector(".modal-container").style.display = "none";
        };


        document.getElementById("modalYes").addEventListener("click", ()=>{
            closeModal();
            resolve(true);
        });

        document.getElementById("modalNo").addEventListener("click", ()=>{
            closeModal();
            resolve(false);
        });

        document.querySelector(".modal-container").addEventListener("click", ()=>{
            closeModal();
            resolve(false);
        });


    });
}

async function deleteTask(deleteImage) {
    const indice = deleteImage.parentElement.id;
    document.querySelector(".modal-container").style.display = "flex";

    const resp = await answerOfModal();

    if(resp){
        tasksList.splice(indice, 1);

        // Esse if else serve apenas para que quando todas as tasks sejam removidas, apareça a task padrão "hello world" e para atualizar a lista quando um item for removido.
        if(tasksList.length == 0){
            localStorage.removeItem("DB");
        }else{
            localStorage.setItem("DB", JSON.stringify(tasksList));
        }
    
        printList();
    }

}

function markATask(label) {
    if(!isInEditing){
        const indice = label.parentNode.id;

        tasksList[indice].isFinished = !tasksList[indice].isFinished; //Alterna o falor de isFinished em uma task. 
        
        localStorage.setItem("DB", JSON.stringify(tasksList));

        if(isSearchMode){
            filterTasks();
        }else {
            printList();
        }
    }
}

function editATask(event){
    if(haveOneClick){
        const input = event.target;
        const indice = input.parentNode.parentNode.id;
        tasksList[indice].isFinished = !tasksList[indice].isFinished;//remarca ou desmarca a task, para não alterar o valor quando da dupolo click
        input.classList.remove("no-caret"); //adiciona o caret quando clicado duas vezes no input
        input.readOnly = false;
        
        input.focus()
        isInEditing = true;
        
        if(input.parentNode.classList.contains("marked")){
            input.parentNode.classList.remove("marked");
        }
        
        event.stopPropagation();
    }else{
        haveOneClick = true;
    }

    setTimeout(()=>{
        haveOneClick = false;
    }, 500);
}

function closeEditingTask(input){
    input.readOnly = true; //ele deve perder o readonly
    input.classList.add("no-caret"); //remove o caret quando o input perde foco.

    const indice = input.parentNode.parentNode.id;
    tasksList[indice].task = input.value;

    isInEditing = false;

    localStorage.setItem("DB", JSON.stringify(tasksList));

    printList();
}

function filterTasks() {
    const text = document.getElementById("input-text").value;
    
    filteredList = tasksList.filter(taskOBJ=>{
        const task = taskOBJ.task;
        return stringContains(task, text);
    });

    printList();
}

function stringContains(text, string){
    const lenText = text.length;
    const lenString = string.length;

    for(let i = 0; i <= lenText - lenString; i++){
        let match = true;

        for(let j = 0; j < lenString; j++){
            if(text[i+j].toLowerCase() != string[j].toLowerCase()){
                match = false;
                break;
            }
        }

        if(match){
            return true;
        }
    }

    return false;
}