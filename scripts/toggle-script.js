const toggle = document.querySelector(".toggle");

toggle.addEventListener("click", ()=>{
    toggle.classList.toggle("actived");
    isSearchMode = !isSearchMode;

    const input = document.getElementById("input-text");

    if(isSearchMode){
        document.getElementById("addSearchBTN").innerText = "Search";
        input.placeholder = "Search here...";
    } else {
        document.getElementById("addSearchBTN").innerText = "Add";
        input.placeholder = "Type a task here...";
    }
    
    input.value = "";
    printList();
});