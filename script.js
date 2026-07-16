var allCards = document.querySelectorAll(".card")
var allPages = document.querySelectorAll(".feature-page")
var allCloseBtns = document.querySelectorAll(".close-btn")
var dashboardSection = document.querySelector("#dashboard")

allCards.forEach(function (card, idx) {
    card.addEventListener('click', function () {
        dashboardSection.style.display = "none"
        allPages[idx].style.display = "block"
    })
})

allCloseBtns.forEach(function (btn, idx) {
    btn.addEventListener("click", function () {
        allPages[idx].style.display = "none"
        dashboardSection.style.display = "block"
    })
})

var themeButton = document.querySelector("#themeToggle")
var toggleDot = document.querySelector("#toggle-circle")
var bodyEl = document.body
var changeTheme = 0

var savedTheme = localStorage.getItem('appTheme')
if (savedTheme === 'dark') {
    bodyEl.classList.add('dark-mode')
    toggleDot.classList.add('moved')
    changeTheme = 1
}

themeButton.addEventListener('click', function () {
    if (changeTheme == 0) {
        bodyEl.classList.add('dark-mode')
        toggleDot.classList.add('moved')
        changeTheme = 1
        localStorage.setItem('appTheme', 'dark')
    } else {
        bodyEl.classList.remove('dark-mode')
        toggleDot.classList.remove('moved')
        changeTheme = 0
        localStorage.setItem('appTheme', 'light')
    }
})

function weatherAndTime() {

    var timeEl = document.querySelector('#clock-time')
    var dateEl = document.querySelector('#clock-date')
    var weatherTempEl = document.querySelector('#weath-temp')
    var weatherConditionEl = document.querySelector('#weath-condition')
    var weatherHumidityEl = document.querySelector('#weath-humidity')
    var weatherWindEl = document.querySelector('#weath-wind')
    var weatherHeatEl = document.querySelector('#weath-heat')

    var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]

    function showTime() {
        var now = new Date()
        var dayName = weekDays[now.getDay()]
        var hours = now.getHours()
        var minutes = now.getMinutes()
        var seconds = now.getSeconds()
        var dayNumber = now.getDate()
        var monthName = monthNames[now.getMonth()]
        var year = now.getFullYear()

        dateEl.innerHTML = dayNumber + ' ' + monthName + ', ' + year

        if (hours > 12) {
            timeEl.innerHTML = dayName + ', ' + String(hours - 12).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + ' PM'
        } else {
            timeEl.innerHTML = dayName + ', ' + String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0') + ' AM'
        }
    }

    showTime()
    setInterval(function () {
        showTime()
    }, 1000)

    async function callWeatherAPI() {
        try {
            var weatherKey = "5a762dd80e4942b9a08163622252606&q"
            var weatherCity = 'Bhubaneswar'
            var weatherResponse = await fetch('http://api.weatherapi.com/v1/current.json?key=' + weatherKey + '=' + weatherCity)
            var weatherData = await weatherResponse.json()
            weatherTempEl.innerHTML = weatherData.current.temp_c + '°C'
            weatherConditionEl.innerHTML = weatherData.current.condition.text
            weatherWindEl.innerHTML = 'Wind: ' + weatherData.current.wind_kph + ' km/h'
            weatherHumidityEl.innerHTML = 'Humidity: ' + weatherData.current.humidity + '%'
            weatherHeatEl.innerHTML = 'Heat Index: ' + weatherData.current.heatindex_c + '°C'
        } catch (err) {
            weatherTempEl.innerHTML = '--°C'
            weatherConditionEl.innerHTML = 'Weather unavailable'
        }
    }

    callWeatherAPI()
}

weatherAndTime()

var expandFlag = 0

function todolist() {
    var taskArray = []
    if (localStorage.getItem('taskArray')) {
        taskArray = JSON.parse(localStorage.getItem('taskArray'))
    }

    var taskForm = document.querySelector('#task-form')
    var nameInput = document.querySelector('#task-name-input')
    var detailsInput = document.querySelector('#task-details-input')
    var impCheck = document.querySelector('#task-imp-check')

    function drawTasks() {
        localStorage.setItem('taskArray', JSON.stringify(taskArray))
        var listBox = document.querySelector('#task-list-container')
        var allTasksHTML = ''
        taskArray.forEach(function (item, idx) {
            var badgeClass = item.imp == true ? 'imp-badge' : 'imp-badge hidden-badge'
            allTasksHTML = allTasksHTML + `<div class="task-item">
                <div style="flex:1">
                  <h3>${item.taskName}<span class="${badgeClass}">imp</span>
                  <i id="${idx}" class="ri-arrow-down-s-fill task-expand-btn" style="cursor:pointer"></i>
                  </h3>
                  <p class="task-details" style="display:none" id="det-${idx}">${item.taskDetails}</p>
                </div>
                <div class="task-right">
                  <button class="remove-btn">Mark Complete</button>
                </div>
              </div>`
        })
        listBox.innerHTML = allTasksHTML

        var arrowIcons = document.querySelectorAll('.task-expand-btn')
        arrowIcons.forEach(function (icon) {
            icon.addEventListener('click', function () {
                var detailsParagraph = document.querySelector('#det-' + icon.id)
                if (expandFlag == 0) {
                    detailsParagraph.style.display = 'block'
                    expandFlag = 1
                } else {
                    detailsParagraph.style.display = 'none'
                    expandFlag = 0
                }
            })
        })

        var removeBtns = document.querySelectorAll('.remove-btn')
        removeBtns.forEach(function (btn, idx) {
            btn.addEventListener('click', function () {
                taskArray.splice(idx, 1)
                drawTasks()
            })
        })
    }

    drawTasks()

    taskForm.addEventListener('submit', function (e) {
        e.preventDefault()
        taskArray.push({
            taskName: nameInput.value,
            taskDetails: detailsInput.value,
            imp: impCheck.checked
        })
        nameInput.value = ''
        detailsInput.value = ''
        impCheck.checked = false
        drawTasks()
    })
}

todolist()

function dailyplanner() {
    var savedSlots = JSON.parse(localStorage.getItem('plannerSlots')) || {}
    var plannerBox = document.querySelector('#planner-grid-container')
    var slotHours = Array.from({ length: 18 }, function (x, i) {
        return (6 + i) + ':00 - ' + (7 + i) + ':00'
    })

    var allSlotsHTML = ''
    slotHours.forEach(function (label, i) {
        var savedValue = savedSlots[i] || ''
        allSlotsHTML = allSlotsHTML + `<div class="planner-slot">
            <p>${label}</p>
            <input id="slot-${i}" type="text" placeholder="..." value="${savedValue}" />
          </div>`
    })
    plannerBox.innerHTML = allSlotsHTML

    var slotInputs = document.querySelectorAll('.planner-slot input')
    slotInputs.forEach(function (inp) {
        inp.addEventListener('input', function () {
            var slotId = inp.id.replace('slot-', '')
            savedSlots[slotId] = inp.value
            localStorage.setItem('plannerSlots', JSON.stringify(savedSlots))
        })
    })
}

dailyplanner()

async function fetchQuote() {
    var quoteDisplay = document.querySelector('#quote-text-display')
    var authorDisplay = document.querySelector('#quote-author-display')
    try {
        var quoteResponse = await fetch('https://dummyjson.com/quotes/random')
        var quoteData = await quoteResponse.json()
        quoteDisplay.innerHTML = quoteData.quote
        authorDisplay.innerHTML = '- ' + quoteData.author
    } catch (err) {
        quoteDisplay.innerHTML = 'Could not load quote.'
        authorDisplay.innerHTML = ''
    }
}

fetchQuote()

function pomodoro() {
    var isWorkSession = true
    var remaining = 1499
    var timerInterval = null
    var displayEl = document.querySelector('#pomo-display')
    var labelEl = document.querySelector('#session-label')
    var startBtn = document.querySelector('#btn-start')
    var pauseBtn = document.querySelector('#btn-pause')
    var resetBtn = document.querySelector('#btn-reset')

    function refreshDisplay() {
        var mins = Math.floor(remaining / 60)
        var secs = remaining % 60
        if (secs == 0 && mins == 0) {
            displayEl.textContent = '0' + mins + ':0' + secs
        } else if (secs < 10) {
            displayEl.textContent = mins + ':0' + secs
        } else if (mins < 10 || mins == 0) {
            displayEl.textContent = '0' + mins + ':' + secs
        } else {
            displayEl.textContent = mins + ':' + secs
        }
    }

    function startSession() {
        clearInterval(timerInterval)
        if (isWorkSession) {
            remaining = 1499
            timerInterval = setInterval(function () {
                if (remaining >= 0) {
                    refreshDisplay()
                    remaining--
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    displayEl.textContent = '05:00'
                    labelEl.textContent = 'Break Time!'
                    labelEl.style.backgroundColor = '#b03a2e'
                }
            }, 1000)
        } else {
            remaining = 299
            timerInterval = setInterval(function () {
                if (remaining >= 0) {
                    refreshDisplay()
                    remaining--
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    displayEl.textContent = '25:00'
                    labelEl.textContent = 'Work Session'
                    labelEl.style.backgroundColor = ''
                }
            }, 1000)
        }
    }

    function stopSession() {
        clearInterval(timerInterval)
    }

    function resetSession() {
        if (isWorkSession) {
            clearInterval(timerInterval)
            remaining = 1499
            refreshDisplay()
            displayEl.textContent = '25:00'
        } else {
            clearInterval(timerInterval)
            remaining = 299
            refreshDisplay()
            displayEl.textContent = '05:00'
        }
    }

    startBtn.addEventListener('click', function () {
        startSession()
        if (remaining == 0) {
            stopSession()
        }
    })

    pauseBtn.addEventListener('click', function () {
        stopSession()
    })

    resetBtn.addEventListener('click', function () {
        resetSession()
    })
}

pomodoro()

function dailyGoals() {
    var goalsArray = []
    if (localStorage.getItem('goalsArray')) {
        goalsArray = JSON.parse(localStorage.getItem('goalsArray'))
    }

    var goalInput = document.querySelector('#goal-text-input')
    var addGoalBtn = document.querySelector('#btn-add-goal')

    function drawGoals() {
        localStorage.setItem('goalsArray', JSON.stringify(goalsArray))
        var goalsBox = document.querySelector('#goals-list-container')
        var allGoalsHTML = ''
        goalsArray.forEach(function (oneGoal, idx) {
            var doneClass = oneGoal.done ? 'done-text' : ''
            var isChecked = oneGoal.done ? 'checked' : ''
            allGoalsHTML = allGoalsHTML + `<div class="goal-item">
                <input type="checkbox" class="goal-check" data-idx="${idx}" ${isChecked} />
                <span class="${doneClass}">${oneGoal.goalText}</span>
                <button class="goal-remove" data-idx="${idx}">Remove</button>
              </div>`
        })
        goalsBox.innerHTML = allGoalsHTML

        var allCheckboxes = document.querySelectorAll('.goal-check')
        allCheckboxes.forEach(function (box) {
            box.addEventListener('change', function () {
                var position = box.getAttribute('data-idx')
                goalsArray[position].done = !goalsArray[position].done
                drawGoals()
            })
        })

        var allRemoveButtons = document.querySelectorAll('.goal-remove')
        allRemoveButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var position = btn.getAttribute('data-idx')
                goalsArray.splice(position, 1)
                drawGoals()
            })
        })
    }

    drawGoals()

    addGoalBtn.addEventListener('click', function () {
        if (goalInput.value.trim() != '') {
            goalsArray.push({ goalText: goalInput.value, done: false })
            goalInput.value = ''
            drawGoals()
        }
    })

    goalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            addGoalBtn.click()
        }
    })
}

dailyGoals()
