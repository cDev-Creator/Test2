const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const listsDisplayContainer = document.querySelector('[data-lists-display-container]')
const listTitle = document.querySelector('[data-list-title]')
const listCount = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')


const randomWord = document.querySelector('[random-word]')
const randomWordButton = document.querySelector('[random-word-button]')
const team1Button = document.querySelector('[team-1-button]')
const team2Button = document.querySelector('[team-2-button]')



const categoryNames = document.querySelector('[category-names]')

const team1Score = document.getElementById('team1-score')
const team2Score = document.getElementById('team2-score')

//const nextRound = document.getElementById('next-round-button')


//const categoryChangeButton = document.getElementById('category-change-button')

const activeCategorySelection = document.querySelector('.active-category-selection')


const winner = document.querySelector('.winner')
const categorySelection = document.querySelector('.category-selection')
const hiddenCategoryAdded = document.querySelector('.lists')
const taskTemplate = document.getElementById('task-template')



const countdown = document.getElementById('countdown')
const timeoutSound = document.getElementById('timeout-sound')
const scoreboard = document.querySelector('.scoreboard')

const selectionButton = document.getElementById('selection-button')
const showButton = document.getElementById('show-button')






// the data attribute is used to store custom data private to a page
// to make a data attribute it must start with 'data-'

// need key-value pairs to store locally
// need to make namespace when storing locally, hence 'task.' added bc
// it prevents you from over-riding info already in local stroage or 
// other websites from overriding my local storage keys
const local_storage_list_key = 'task.lists'
const local_storage_list_id_key = 'task.selectedListId'




// get information from local storage using this key and if it exists parse it into
// an object or if it does not exist give an empty array of lists to start
let lists = JSON.parse(localStorage.getItem(local_storage_list_key)) || []

let selectedListId = localStorage.getItem(local_storage_list_id_key)


hiddenCategoryAdded.style.display = 'none'
function hideWordAdder(){
   
    if(hiddenCategoryAdded.style.display === 'none') {
        hiddenCategoryAdded.style.display = 'flex'
    }
    else {
        
        hiddenCategoryAdded.style.display = 'none'
    }
    if(hiddenCategoryAdded.style.display === 'none') {
        showButton.innerHTML = 'add words'
    }
    if(hiddenCategoryAdded.style.display === 'flex') {
        showButton.innerHTML = 'hide'
    }
    
}

function renderLists() {
    // for each list inside of lists create a li element with the right class added
    // list.name so that the list will be identifible by the entered name
    // listsContainer.appendChild(listElement) actually adds the item to the list
    // listElement.dataset.listId = list.id adds data attribute so that its possible to know which list is being selected
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        
        listElement.innerText = list.name
        // if list is currently selected list set it to active list
        if (list.id === selectedListId) {
            listElement.classList.add("active-list")
        }
        listsContainer.appendChild(listElement)

    })

}

    function renderCategories() {
        lists.forEach(list => {

      
            const listElement = document.createElement('li')
            
            listElement.dataset.listId = list.id
            //listElement.classList.add("list-names")
            
            listElement.classList.add("category-selection")
            listElement.classList.add("list-name")

            listElement.innerText = list.name
       

         

           
            

          // listElement.style.display = "none"

            // if list is currently selected list set it to active list
            if (list.id === selectedListId) {
                listElement.classList.add("active-category-selection")
                listElement.style.display = ""
            }

            

            categoryNames.appendChild(listElement)
       
        })
        
    }
   
listsContainer.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId

        saveAndRender()
    }
}) 





categoryNames.addEventListener('click', e => {

    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId

        saveAndRender()
    }
})  


/* let clickCounter = 0

categoryChangeButton.addEventListener('click', e =>{
   
clickCounter++
const keys = lists.keys()
    
for (let x of keys) { 
    console.log(x);
} 
console.log('asasas' +clickCounter)



if(clickCounter >= lists.length) {
    clickCounter = 0
   // console.log(clickCounter)
}

   
const names = lists.map(function (list) {
    return list.name;
});

console.log(names)
    
    console.log(lists)

    //console.log(lists[0].name)
   // console.log(lists[1].name)
   // console.log(lists[2].name)


    //console.log(lists.length)


   saveAndRender() 
          
}) */
























tasksContainer.addEventListener('click', e => {

    // if checkbox has been marked(input)
    if(e.target.tagName.toLowerCase() === 'input') { 
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        
        save()
        taskCount(selectedList)
    }
})

deleteListButton.addEventListener('click', e => {
    // finds which has selectedListId and deletes it, value set to null bc its not longer the selected list
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    // set task list to all tasks which have not been completed
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})
newListForm.addEventListener('submit', e => {
    //stops page from refreshing when enter is pressed in new list name box
    e.preventDefault();
    // .value must be added to get the string value that was typed in 
    const listName = newListInput.value
    if (listName == null || listName === '') return
    // if name is typed in create a new list
    const list = createList(listName)
    // clears list name from list adder bar once its successfully added
    newListInput.value = null
    // takes lists variable (all lists) and adds the new list to it
    lists.push(list)



    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    
    newTaskInput.value = null

    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)

    saveAndRender()
}) 


function createList(name) {
    // returns object, Date.now().toString() take the date and current tinme and convert them to a string to 
    // give a unique identifier, name is set to the name and each list will have a set of tasks
    return {id: Date.now().toString(), name: name, tasks:[] } 
}

function createTask(name) {
    return {id: Date.now().toString(), name: name, complete: false } 
}


function saveAndRender() {
    save()
    render()
}

function save() {
   localStorage.setItem(local_storage_list_key, JSON.stringify(lists)) 
   
   localStorage.setItem(local_storage_list_id_key, selectedListId)

}

function render() {
    // bc it clears and then re-renders everything i dont have to manually remove the class of active list 
    // from the selected and then unselected lists
    clearElement(listsContainer)

    clearElement(categoryNames)
    
    renderLists()
    renderCategories()
    const selectedList = lists.find(list => list.id === selectedListId)
    // if no list is selcted task section will disappear
    // else task section will be shown '' reverts it to normal
    if(selectedListId == null) {
        listsDisplayContainer.style.display = 'none'

    } else {
        listsDisplayContainer.style.display = ''
        // sets title of task area to whatever list is selected
        listTitle.innerText = selectedList.name
        taskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)

       
        
    }
}

function clearElement(element) {
    // makes sure everything in list is deleted everytime that render is called
    // hard coded list names will not show up, only ones entered by user 
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function renderTasks(selectedList) {
    //runs for every task 
    selectedList.tasks.forEach(task => {
        // renders everything in template when true is added, without true would just add top most 
        // div information
        const taskElement = document.importNode(taskTemplate.content, true)

        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete

        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function taskCount(selectedList) {
    // get every task that is not complete
    const numberOfWords = selectedList.tasks.filter(task => !task.complete).length


    // if just one task 'task' will be singular, else it will be 'tasks'
    const taskString = numberOfWords === 1 ? "word" : "words"
    listCount.innerText = `${numberOfWords} ${taskString}`
}

function random(selectedList)  {
    
    const wordsListLength = selectedList.tasks.filter(task => task).length
    const random = Math.floor(Math.random()*wordsListLength)
    console.log(selectedList.tasks[random].name)

    let word = (selectedList.tasks[random].name)
    randomWord.innerText = `${word}`
}





////let team1Points = '0'
//localStorage.setItem('team1Points',team1Points)
var team1Points = 0
var team2Points = 0

function gameLoop() {

let clickCounter = 0

randomWordButton.addEventListener('click', e => { 
    clickCounter++;
    console.log(clickCounter)

    if(clickCounter === 1 ) {
        startTimer() 
        gameSound.play()
       
        randomWordButton.innerHTML = 'next'
    }

    const selectedList = lists.find(list => list.id === selectedListId)
    random(selectedList)
    randomWord.style.visibility = 'visible'
})

    hideButtons()

    team1Button.addEventListener('click', e => {
        team1Points++
        
        team1Score.innerText = `${team1Points}`
        if(team1Points === 3 || team1Points === 3 ) {
            gameWinner()
            resetButton.style.visibility = 'visible'
    
        }
        
        // reset the timer one score has been logged
        resetTimer();
        selectionButton.style.display = 'flex'
        randomWord.style.visibility = 'hidden'
        randomWordButton.style.display = 'none'
        categorySelection.style.display = 'flex'
        scoreboard.style.display = 'flex'
        countdown.style.visibility = 'hidden'
        showButton.style.display = 'flex'
        
        scoreButtonsHidden()
        // click count is set to zero at the end of each round 
        clickCounter = 0
        randomWordButton.innerHTML = 'start'
        
    })
    team2Button.addEventListener('click', e => {
        team2Points++
        team2Score.innerText = `${team2Points}`
        if(team1Points === 3 || team2Points === 3 ) {
            gameWinner()
           
    
        }
        
        resetTimer();
        selectionButton.style.display = 'flex'
        randomWord.style.visibility = 'hidden'
        randomWordButton.style.display = 'none'
        categorySelection.style.display = 'flex'
        scoreboard.style.display = 'flex'
        countdown.style.visibility = 'hidden'
        showButton.style.display = 'flex'
        scoreButtonsHidden()
        clickCounter = 0
        randomWordButton.innerHTML = 'start'
    })
    
    function gameWinner() {
        if (team1Points === 3) {
            winner.innerText = `Team 1 wins`
            winSound.play()
        }
        else if (team2Points === 3) {
            winner.innerText = `Team 2 wins`
            winSound.play()
        }
       disableButtons() 

       // resets game after 4 seconds once a winner has been declared
       setTimeout(rat, 5000);
       function rat() {
            window.location.reload();
            
       }
    }
    
    function disableButtons() {
       team1Button.disabled = true
       team2Button.disabled = true
       randomWordButton.disabled = true
       selectionButton.disabled = true
    }
    function hideButtons() {
        team1Button.style.display = 'none'
        team2Button.style.display = 'none'
        randomWordButton.style.display = 'none'
    }

   




// Select timeout Audio element
//const timeoutAudio = document.getElementById("timeout_audio");

// variable to store count
var remainingTime = 60;

// variable to store time interval
var timer;
const startTimer = () => {

    countdown.innerHTML = remainingTime;
    timer = setInterval(renderTime, 1000);


  if(remainingTime === 0) {
      stopTimer();
  }
};

const resetTimer = () => {
  clearInterval(timer)
  remainingTime = 60;
  countdown.innerHTML = remainingTime
}

const gameSound = document.getElementById("game-sound")
const winSound = document.getElementById("win-sound")

timeoutSound.src = "http://soundbible.com/grab.php?id=1252&type=mp3"
gameSound.src = "timesound.mp4"
winSound.src = "win.mp3"
timeoutSound.load()
gameSound.load()
winSound.load()

selectionButton.addEventListener('click', () =>{
  
    randomWordButton.style.display = 'flex'
    categorySelection.style.display = 'none'
    selectionButton.style.display = 'none'
    scoreboard.style.display = 'none'
    countdown.style.visibility = 'visible'
    showButton.style.display = 'none'
    hiddenCategoryAdded.style.display = 'none'
    

})

/* resetButton.addEventListener('click', () =>{
    resetTimer();
    randomWord.style.visibility = 'hidden'
    randomWordButton.style.visibility = 'hidden'
    categorySelection.style.visibility = 'visible'

}) */
function scoreButtonsHidden(){
    team1Button.style.display = 'none'
    team2Button.style.display = 'none'
}


function scoreButtonsVisible(){
    team1Button.style.display = 'flex'
    team2Button.style.display = 'flex'
}

// function to display time
const renderTime = () => {
  remainingTime -= 1
  // render count on the screen
  countdown.innerHTML = remainingTime
  
    if(remainingTime <= 30) {
        gameSound.playbackRate = 1.5
    }
    if(remainingTime <= 20) {
        gameSound.playbackRate = 2.0
    }
    if(remainingTime <= 15) {
        gameSound.playbackRate = 2.5
    }
    if(remainingTime <= 10) {
        gameSound.playbackRate = 3.0
    }

    if (remainingTime === 0) {

        clearInterval(timer)
        scoreButtonsVisible()
        gameSound.pause();
        timeoutSound.play()

        remainingTime = 60
        selectionButton.style.display = 'none'
        randomWordButton.style.display = 'none'
    }  
}



}
gameLoop()

render()