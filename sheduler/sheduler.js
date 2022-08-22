const dom = {
    calendar: document.getElementById('calendar'),
    datePicker: document.getElementById('month_block_picker'),
    todayBtn: document.getElementById('today_btn'),
}

const startWorkingHour = 9
const endWorkingHour = 18
const date = new Date()
const currentDate = date.getDate()
const currentMonth = date.getMonth()
const currentYear = date.getFullYear()
const currentHour = date.getHours()
let numSelectYears = 2

let displayedMonthIdx = currentMonth
let displayedYear = currentYear
let displayedDay = currentDate
let displayedTypeCalendar = 'week'
let isChangedMonth = false
let displayedMonthDatePickerIdx = currentMonth

let checkedMy = true
let checkedFree = false

let events = []
let selectedCities = []
let activeClasses = []
let selectedClasses = []

//ВХОДЯЩИЕ ДАННЫЕ
//Для заполнения селектора городов:
const cities = ['Липецк', 'Калуга', 'Астрахань', 'Москва', 'Владимир', 'Иваново']

//Для заполнения селектора классов:
let groupsUpToFive = ['АБК ЦДС', 'АБК ЦХПП', 'АБК УЖДТ']
let groupsUpToSix = ['АБК КХЦ']
let groupsAllTime = ['Территория знаний(1)', 'Территория знаний(2)']

//Для заполнения созданных событий:
const startEvents = [
    {
        date: '18-08-2022',
        title: 'АБК ЦДС',
        time: '14',
        occupied_places: 2,
        total_places: 8,
        itsMyEvent: true,
        city: 'Москва',
        id: '222222',
    }, {
        date: '18-08-2022',
        title: 'АБК ЦХПП',
        time: '12',
        occupied_places: 2,
        total_places: 8,
        itsMyEvent: true,
        city: 'Москва',
        id: '222222',
    }, {
        date: '18-08-2022',
        title: 'АБК ЦХПП',
        time: '9',
        occupied_places: 2,
        total_places: 10,
        itsMyEvent: false,
        city: 'Иваново',
        id: '123',
    }, {
        date: '18-08-2022',
        title: 'АБК УЖДТ',
        time: '13',
        occupied_places: 9,
        total_places: 10,
        itsMyEvent: true,
        city: 'Липецк',
        id: '12345',
    },
    {
        date: '18-08-2022',
        title: 'АБК КХЦ',
        time: '9',
        total_places: 10,
        occupied_places: 10,
        itsMyEvent: true,
        city: 'Калуга',
        id: '3213',
    },
    {
        date: '18-08-2022',
        title: 'АБК ЦДС',
        time: '19',
        total_places: 10,
        occupied_places: 10,
        itsMyEvent: false,
        city: 'Калуга',
        id: '32137',
    },
    {
        date: '18-08-2022',
        title: 'АБК ЦХПП',
        time: '10',
        total_places: 10,
        occupied_places: 10,
        itsMyEvent: false,
        city: 'Калуга',
        id: '3212',
    },
    {
        date: '18-08-2022',
        title: 'АБК ЦДС',
        time: '11',
        total_places: 10,
        occupied_places: 10,
        itsMyEvent: false,
        city: 'Калуга',
        id: '3214',
    }, {
        date: '18-08-2022',
        title: 'АБК УЖДТ',
        time: '12',
        total_places: 10,
        occupied_places: 1,
        itsMyEvent: false,
        city: 'Калуга',
        id: '321',
    },
]
//ВХОДЯЩИЕ ДАННЫЕ

let filteredGroupsUpToFive = groupsUpToFive
let filteredGroupsUpToSix = groupsUpToSix
let filteredGroupsAllTime = groupsAllTime

const weekDaysNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const months = [
    {
        name: 'Январь',
        days: 31,
    },
    {
        name: 'Февраль',
        days: 28 + isLeapYear(),
    },
    {
        name: 'Март',
        days: 31,
    },
    {
        name: 'Апрель',
        days: 30,
    },
    {
        name: 'Май',
        days: 31,
    },
    {
        name: 'Июнь',
        days: 30,
    },
    {
        name: 'Июль',
        days: 31,
    },
    {
        name: 'Август',
        days: 31,
    },
    {
        name: 'Сентябрь',
        days: 30,
    },
    {
        name: 'Октябрь',
        days: 31,
    },
    {
        name: 'Ноябрь',
        days: 30,
    },
    {
        name: 'Декабрь',
        days: 31,
    },
]

//Проверка год текущего года на высокосный
function isLeapYear() {
    if (currentYear % 4 === 0 && (currentYear % 100 !== 0 || currentYear % 400 === 0)) {
        return 1
    }
    return 0
}
//Проверка год текущего года на высокосный


//СТАРТОВАЯ ФУНКЦИЯ С ФИЛЬТРАЦИЕЙ СОБЫТИЙ
filtration()
//СТАРТОВАЯ ФУНКЦИЯ С ФИЛЬТРАЦИЕЙ СОБЫТИЙ

//Фильтрация
function filtration(isFilteredClasses = true) {
    if (selectedCities.length === 0) {
        selectedCities = cities
    }

    if (checkedMy) {
        events = startEvents.filter(event => event.itsMyEvent)
    } else {
        events = startEvents
    }

    if (checkedFree) {
        events = events.filter(event => (event.total_places - event.occupied_places) !== 0)
    }

    events = events.filter(event => selectedCities.includes(event.city))

    function filterActiveClasses(group) {
        let filteredGroup = []
        for (let i = 0; i < events.length; i++) {
            if (group.includes(events[i].title)) {
                filteredGroup.push(events[i].title)
            }
        }
        return [...new Set(filteredGroup)]
    }

    filteredGroupsUpToFive = filterActiveClasses(groupsUpToFive)
    filteredGroupsUpToSix = filterActiveClasses(groupsUpToSix)
    filteredGroupsAllTime = filterActiveClasses(groupsAllTime)

    isFilteredClasses && makeOptions()

    activeClasses = filteredGroupsUpToFive.concat(filteredGroupsUpToSix).concat(filteredGroupsAllTime)

    if (selectedClasses.length === 0) {
        selectedClasses = groupsUpToFive.concat(groupsUpToSix).concat(groupsAllTime)
    }

    events = events.filter(event => selectedClasses.includes(event.title))

    if (displayedTypeCalendar === 'day') {
        renderDay(displayedMonthIdx, displayedYear, displayedDay)
    }
    if (displayedTypeCalendar === 'week') {
        renderWeek(displayedDay, displayedMonthIdx)
    }
    if (displayedTypeCalendar === 'month') {
        renderMonth(displayedMonthIdx, displayedYear)
    }
}
//Фильтрация

//MONTH
function renderMonth(monthIdx, year) {
    let container = document.getElementById('calendar'),
        cTable = document.createElement('table')
    container.innerHTML = ''
    container.appendChild(cTable)

    const month = months[monthIdx]
    const monthContentHTML = []
    handleToDayBtn(1, 1, 1)
    const monthBox = document.createElement('div')
    monthBox.className = 'month'

    monthContentHTML.push(['<div class="month__content">'])
    monthContentHTML.push(renderWeekDaysNames())
    monthContentHTML.push(buildDates(year, monthIdx, month.days))
    monthContentHTML.push(`</div>`)

    monthBox.innerHTML = monthContentHTML.join('')
    dom.calendar.appendChild(monthBox)
}

function renderWeekDaysNames() {
    const dayNames = []
    for (let i = 0; i < 7; i++) {
        const dayNameTag = `<div class='month__date_accent'>
                                <div class="week_day_name">${weekDaysNames[i]}</div>
                            </div>`
        dayNames.push(dayNameTag)
    }
    return dayNames.join('')
}

function buildDates(year, month, daysCount) {
    let isPastMonths = year === currentYear && month < currentMonth
    if (year !== currentYear) {
        isPastMonths = true
    }

    const date = new Date(year, month, 1)
    const datesHTML = []
    const weekDayStart = date.getDay()

    const monthStart = date.getMonth()
    const prevMonthsDays = () => {
        if (monthStart === 0) {
            return months[11].days
        } else {
            return months[monthStart - 1].days
        }
    }
    const corrector = weekDayStart === 0 ? 5 : weekDayStart - 2
    let prevMonthDayStart = prevMonthsDays() - corrector
    let nextMonthDayStart = 1

    const daysInWeek = 7
    let firstDayWeekIdx = 1
    let firstDayMonth = 1
    let currentCellsNum = 0
    let cellsNum = 42
    let dateHTML
    //Заполнение ячеек предыдущим и текущими датами
    while (firstDayMonth <= daysCount) {
        if (firstDayWeekIdx < weekDayStart || weekDayStart === 0 && firstDayWeekIdx < daysInWeek) {
            dateHTML = buildDate(prevMonthDayStart, month - 1, year, true)
            datesHTML.push(dateHTML)
            currentCellsNum++
            prevMonthDayStart++
            firstDayWeekIdx++
        } else {
            if (isPastMonths) {
                dateHTML = buildDate(firstDayMonth, month, year, true)
            } else {
                dateHTML = buildDate(firstDayMonth, month, year)
            }

            datesHTML.push(dateHTML)
            currentCellsNum++
            firstDayMonth++
        }
    }
    //Заполнение ячеек следующим месяцем
    while (currentCellsNum < cellsNum) {
        dateHTML = buildDate(nextMonthDayStart, month + 1, year, true)
        datesHTML.push(dateHTML)
        currentCellsNum++
        nextMonthDayStart++
    }

    return datesHTML.join('')
}

function buildDate(content, month, year, isAccent = false) {
    let isCurrentDay = false
    if (content === currentDate && currentYear === year && currentMonth === month) {
        isCurrentDay = true
    }
    const currentEvent = events.filter(event => {
        const el = event.date.split('-')
        if (+el[0] === content && +el[1] === (month + 1) && +el[2] === year) {
            return event
        }
    })
    const processedMonth = month + 1
    const cellId = `${content}_${processedMonth}_${year}`

    const another_month = isAccent && 'another_month'
    const clsNum = isCurrentDay ? 'date_num date_num__active' : 'date_num'
    const clsEvent = currentEvent.length > 0 ? 'date_event' : 'no_event'
    let countPlaces = ''

    return `<div class="month_date" id="${cellId}">
              <div class="${clsNum}"><div class="${another_month}">${content}</div></div>
                 <div class="events_container">
                  
                          ${currentEvent.map(event => {
        const vacancies = event.total_places - event.occupied_places
        if (vacancies === 0) {
            countPlaces = 'мест нет'
        } else {
            countPlaces = `${vacancies} свободно из ${event.total_places}`
        }
        return `<div class="${clsEvent}"  key=${event.id}>
                                     <div class="event_status"></div>
                                     <div id="${event.id}" class="event_title">${event?.title}</div>
                                     <div class="event_title comment">| ${countPlaces}</div>
                                </div>`
    }).join('')}
                          
                  </div>
            </div>`
}
//MONTH

/*WEEK*/
function renderWeek(day, monthIdx, buttonType) {
    let container = document.getElementById('calendar'),
        cTable = document.createElement('table')
    container.innerHTML = ''
    container.appendChild(cTable)

    const monthContentHTML = []
    let month = monthIdx + 1
    const styleCell = 'week_date_hours'

    let prevMonthDays = monthIdx === 0 ? daysInMonth(12, displayedYear) : daysInMonth(month - 1, displayedYear)
    const currentMonthDays = monthIdx === 12 ? daysInMonth(1, displayedYear) : daysInMonth(month, displayedYear)

    const date = new Date(displayedYear, monthIdx, day)
    let weekDayStartIdx = date.getDay() - 1
    if (weekDayStartIdx < 0) {
        weekDayStartIdx = 6
    }
    let presentDay = day - weekDayStartIdx
    if (presentDay <= 0) {
        presentDay = prevMonthDays + presentDay
    }

    const monthBox = document.createElement('div')
    monthBox.className = 'week'

    monthContentHTML.push(['<div class="header_week_content">'])
    monthContentHTML.push(renderWeekDaysNamesForWeek(day, monthIdx, presentDay, weekDayStartIdx))
    monthContentHTML.push(`</div>`)

    monthContentHTML.push(['<div id="content_week_tab" class="content_tab">'])

    monthContentHTML.push(['<div class="hours">'])
    monthContentHTML.push(renderHours())
    monthContentHTML.push(`</div>`)

    monthContentHTML.push(['<div class="hours_days">'])

    //monthNumDays-корректор, т.к. селектор меняет значение в зависимости от появления первых чисел следующего месяца для id
    let monthNumDays = daysInMonth(month, displayedYear)
    //отслеживание пересечений месяцев
    if (presentDay + 6 > monthNumDays) {
        if (month === 1) {
            month = 12
            displayedYear -= 1
        } else {
            month -= 1
        }
    }

    for (let i = 0; i < 7; i++) {
        if (buttonType === 'next') {
            if (presentDay > prevMonthDays) {
                presentDay = 1
                month += 1
                if (month > 12) {
                    month = 1
                    displayedYear += 1
                }
            }
        }
        if (buttonType === 'prev') {
            if (isChangedMonth && !(presentDay + 6 > monthNumDays)) {
                prevMonthDays = currentMonthDays
                isChangedMonth = false
            }
            if (presentDay > prevMonthDays) {
                presentDay = 1
                month += 1
                if (month > 12) {

                    month = 1
                    displayedYear += 1
                }
            }
        }

        monthContentHTML.push(['<div class="hours_day">'])
        monthContentHTML.push(buildCellsHoursDay(presentDay, month, displayedYear, styleCell))
        presentDay++
        monthContentHTML.push(`</div>`)
    }

    monthContentHTML.push(`</div>`)
    monthContentHTML.push(`</div>`)
    monthBox.innerHTML = monthContentHTML.join('')
    dom.calendar.appendChild(monthBox)

    //перемотка блока на текущее время
    const scrollHeight = currentHour > 6 ? (currentHour - 4) * 66 : 0
    document.getElementById('content_week_tab').scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
    });
}

function renderWeekDaysNamesForWeek(day, month, presentDay, weekDayStart) {
    handleToDayBtn(day, month, displayedYear)
    const dayNames = []
    let prevStartDay = presentDay
    let weekDayStartIdx = weekDayStart
    let presentMonth = month
    let nextDay = day + 1
    const monthLength = () => {
        if (nextDay > daysInMonth(presentMonth + 1, displayedYear)) {
            nextDay = 1
            presentMonth += 1
            if (presentMonth > 11) {
                presentMonth = 0
            }
        }

        const presentMonthValue = presentMonth === 0 ? 11 : presentMonth - 1
        if (prevStartDay > daysInMonth(presentMonthValue + 1, displayedYear)) {
            prevStartDay = 1
            presentMonth += 1
        }
    }
    monthLength()

    let dayNameTag = `<div class='week_date dis' >
                        <div class="view_week_day_name"></div>
                      </div>`

    dayNames.push(dayNameTag)

    const isLastDay = (day, month, year) => {
        return day < currentDate && month <= currentMonth && year <= currentYear;
    }

    const isCurrentMonthYear = (year, month) => {
        return currentYear === year && currentMonth === month
    }
    const isCurrentDayMonthYear = (year, month, day) => {
        return currentYear === year && currentMonth === month && currentDate === day
    }

    const renderCurrentDate = (dayIdx) => {

        return `<div class='week_date'>
                                <div class="view_week_day_name">${weekDaysNames[dayIdx]}</div>
                                <div class="week_current_date accent">${currentDate}</div>
                            </div>`
    }
    const renderPrevDate = (dayIdx, dayNum) => {
        return `<div class='week_date'>
                                <div class="view_week_day_name dis">${weekDaysNames[dayIdx]}</div>
                                  <div class="week_current_date dis">${dayNum}</div>
                            </div>`
    }
    const renderNextDate = (dayIdx, dayNum) => {
        return `<div class='week_date'>
                                <div class="view_week_day_name">${weekDaysNames[dayIdx]}</div>
                                  <div class="week_current_date">${dayNum}</div>
                            </div>`
    }

    for (let i = 0; i < 7; i++) {
        const dayIdx = i
        let dayNameTag

        if (isCurrentMonthYear(displayedYear, month)) {
            //Неделя с текущим днем
            if (dayIdx === weekDayStartIdx && isCurrentDayMonthYear(displayedYear, month, day)) {
                dayNameTag = renderCurrentDate(dayIdx)
            }

            if (dayIdx === weekDayStartIdx && day > currentDate) {
                dayNameTag = renderNextDate(dayIdx, day)
            }

            if (dayIdx === weekDayStartIdx && day < currentDate) {
                dayNameTag = renderPrevDate(dayIdx, day)
            }
            //недели текущего месяца до текущего дня
            if (dayIdx < weekDayStartIdx && isCurrentDayMonthYear(displayedYear, month, prevStartDay)) {
                dayNameTag = renderCurrentDate(dayIdx)
                prevStartDay++
            } else if (dayIdx < weekDayStartIdx && isLastDay(prevStartDay, presentMonth, displayedYear)) {
                dayNameTag = renderPrevDate(dayIdx, prevStartDay)
                prevStartDay++
            } else if (dayIdx < weekDayStartIdx) {
                dayNameTag = renderNextDate(dayIdx, prevStartDay)
                prevStartDay++
            }

            //недели текущего месяца после текущего дня
            if (dayIdx > weekDayStartIdx && nextDay > currentDate) {
                dayNameTag = renderNextDate(dayIdx, nextDay)
                nextDay++
                monthLength()
            } else if (dayIdx > weekDayStartIdx) {
                if (isLastDay(nextDay, presentMonth, displayedYear)) {
                    dayNameTag = renderPrevDate(dayIdx, nextDay)
                    nextDay++
                    monthLength()
                } else if (isCurrentDayMonthYear(displayedYear, month, nextDay)) {
                    dayNameTag = renderCurrentDate(dayIdx)
                    nextDay++
                } else {
                    dayNameTag = renderNextDate(dayIdx, nextDay)
                    nextDay++
                    monthLength()
                }

            }
        }

        if (displayedYear === currentYear) {
            //месяца до текущего
            if (month < currentMonth) {
                if (i === weekDayStartIdx) {
                    dayNameTag = renderPrevDate(dayIdx, day)
                }
                if (i < weekDayStartIdx) {
                    dayNameTag = renderPrevDate(dayIdx, prevStartDay)
                    prevStartDay++
                    monthLength()
                }
                if (i > weekDayStartIdx) {
                    dayNameTag = renderPrevDate(dayIdx, nextDay)
                    nextDay++
                    monthLength()
                }
            }

            // месяца после текущего
            if (month > currentMonth) {
                if (i === weekDayStartIdx) {
                    dayNameTag = renderNextDate(dayIdx, day)
                }
                if (i < weekDayStartIdx) {
                    if (prevStartDay > months[month - 1].days) {
                        prevStartDay = 1
                    }
                    dayNameTag = renderNextDate(dayIdx, prevStartDay)
                    prevStartDay++
                }
                if (i > weekDayStartIdx) {
                    dayNameTag = renderNextDate(dayIdx, nextDay)
                    nextDay++
                    monthLength()
                }
            }
        } else if (presentDay > day && month === 0 && (currentYear + 1 === displayedYear)) {
            if (i === weekDayStartIdx) {
                dayNameTag = renderPrevDate(dayIdx, day)
                monthLength()
            }
            if (i < weekDayStartIdx) {
                dayNameTag = renderNextDate(dayIdx, prevStartDay)
                prevStartDay++
                monthLength()
            }
            if (i > weekDayStartIdx) {
                dayNameTag = renderPrevDate(dayIdx, nextDay)
                nextDay++
                monthLength()
            }

        } else {
            if (i === weekDayStartIdx) {
                dayNameTag = renderPrevDate(dayIdx, day)
            }
            if (i < weekDayStartIdx) {
                dayNameTag = renderPrevDate(dayIdx, prevStartDay)
                prevStartDay++
                monthLength()
            }
            if (i > weekDayStartIdx) {
                dayNameTag = renderPrevDate(dayIdx, nextDay)
                nextDay++
                monthLength()
            }

        }

        dayNames.push(dayNameTag)
    }
    return dayNames.join('')
}

function renderHours(isCurrentHour = true) {
    const date = new Date()
    const currentHour = date.getHours()
    const currentMinute = date.getMinutes()
    const curMin = currentMinute < 10 ? `0${currentMinute}` : currentMinute
    const curHour = currentHour < 10 ? `0${currentHour}` : currentHour

    const dayNames = []
    for (let i = 0; i < 24; i++) {
        let hour = i
        if (i < 10) hour = `0${i}`
        if (i === 24) hour = `00`

        const isDisabled = i < startWorkingHour || i > endWorkingHour
        let cls = isDisabled
            ? `hour_title_no_active ${!isCurrentHour && 'hour_date_correct'}`
            : `hour_title ${!isCurrentHour && 'hour_date_correct'}`

        let hourTag

        if (currentHour === i && isCurrentHour) {
            hourTag = `<div class='current_hour_cell'>
                                <div class="current_hour">${curHour}:${curMin}</div>
                                   <div class="time_line_block">
                                    <div class="current_hour_current_day"></div>
                                   </div>
                                <div class='hour_cell'>
                                    <div class="${cls}">${hour}:00</div>
                                    <div class="hour_border"></div>
                                </div>
                            </div>`
        } else if (isCurrentHour) {
            hourTag = `<div class='hour_cell'>
                                <div class="${cls}">${hour}:00</div>
                                <div class="hour_border"></div>
                            </div>`
        } else {
            hourTag = `<div class='hour_cell'>
                                <div class="${cls}">${hour}:00</div>
                            </div>`
        }

        dayNames.push(hourTag)
    }
    return dayNames.join('')
}

function buildCellsHoursDay(presentDay, month, year, styleCell) {
    const datesHTML = []
    let dateHTML
    for (let i = 0; i < 24; i++) {
        const hour = i
        const isActive = i < startWorkingHour - 1 || i > endWorkingHour - 1
        dateHTML = buildCellHour(presentDay, month, year, hour, isActive, styleCell)
        datesHTML.push(dateHTML)
    }

    return datesHTML.join('')
}

function buildCellHour(presentDay, month, year, hour, isActive, styleCell) {
    const currentEvent = events.filter(event => {
        const el = event.date.split('-')
        const isEventDate = +el[0] === presentDay && +el[1] === (+month) && +el[2] === year
        if (isEventDate) {
            const halfTotalPlaces = event.total_places / 2
            const occupied_places = event.occupied_places
            const freePlaces = event.total_places - occupied_places

            if (freePlaces === 0) return event.eventType = 'noPlaces'
            if (occupied_places > halfTotalPlaces) return event.eventType = 'fewPlaces'
            if (halfTotalPlaces > occupied_places) return event.eventType = 'manyPlaces'

            return event
        }
    })

    const clsEvent = currentEvent.length > 0 ? 'time_event' : 'no_event'
    let clsCell = !isActive ? styleCell : `${styleCell}_hour_no_active`

    const cellId = `${presentDay}_${month}_${year}_${hour}`

    return `<div class="${clsCell}" id="${cellId}"> 
                 <div class="events_container_view_week">  
                          ${currentEvent.map(event => {
        const isEventTime = +event.time === hour + 1
        const occupied_places = event.occupied_places
        const total_places = event.total_places
        if (!event.itsMyEvent && isEventTime) {
            const eventType = event.eventType
            const freePlaces = event.total_places - occupied_places
            let activeTitle

            if (eventType === 'noPlaces') {
                const color = '#E00000'
                activeTitle = `<div class="event_description " style="color :${color};"  id="${event.id}">Мест нет ${occupied_places} из ${total_places}</div>`
            }
            if (eventType === 'fewPlaces') {
                const color = '#FF8B0F'
                activeTitle = `<div class="event_description " style="color :${color};"  id="${event.id}">Есть ${freePlaces} из ${total_places}</div>`
            }
            if (eventType === 'manyPlaces') {
                const color = '#0D932B'
                activeTitle = `<div class="event_description " style="color :${color};"  id="${event.id}">Есть места ${freePlaces} из ${total_places}</div>`
            }

            return `<div class="${clsEvent} ${eventType}" id="${event.id}" >
                                     <div class="event_count_users" ${event.id}>
                                 ${activeTitle}
                                   </div>
                </div>`
        } else if (event.itsMyEvent && isEventTime) {

            return `<div class="${clsEvent}" id="${event.id}">
                                     <div  class="event_title_week" id="${event.id}">${event?.title}</div>
                                     <div class="event_count_users" ${event.id}>
                                        <img src="icons/user_icon.jpg" alt="icon" class="user_img">
                                        <div class="event_description" id="${event.id}">${occupied_places} ${declOfNumParticipant(occupied_places)}</div>
                                     </div>
                </div>`
        }
    }).join('')}
                          
                  </div>
            </div>`
}
/*WEEK*/

/*DAY*/
function renderDay(monthIdx, year, day) {
    let container = document.getElementById('calendar'),
        cTable = document.createElement('table')
    container.innerHTML = ''
    container.appendChild(cTable)

    const date = new Date(year, monthIdx, day)
    let weekDay = date.getDay() - 1
    if (weekDay < 0) {
        weekDay = 6
    }

    let month = monthIdx + 1
    if (month < 10) month = `0${month}`

    handleToDayBtn(day, monthIdx, year)

    const monthContentHTML = []
    const styleCell = 'day_date_hours'
    const monthBox = document.createElement('div')
    monthBox.className = 'day'

    monthContentHTML.push(['<div id="day__content" class="day__content">'])

    monthContentHTML.push(['<div class="header_day">'])
    monthContentHTML.push(renderDaysHeader(day, monthIdx, year, weekDay,))
    monthContentHTML.push(`</div>`)

    monthContentHTML.push(['<div id="content_day_tab" class="content_day_tab">'])

    monthContentHTML.push(['<div class="hours">'])
    monthContentHTML.push(renderHours(false))
    monthContentHTML.push(`</div>`)

    monthContentHTML.push(['<div class="day_tab_container">'])
    let activeClasses = selectedClasses
    if (activeClasses[0] === 'All') {
        activeClasses = activeClasses.filter(cl => cl !== 'All')
    }
    if(activeClasses.length===1){
        monthContentHTML.push(['<div class="day_tab_width_all">'])
        monthContentHTML.push(buildCellsDay(day, month, year, styleCell, activeClasses[0]))
        monthContentHTML.push(`</div>`)
    }else{
        for (let i = 0; i < 6; i++) {

            monthContentHTML.push(['<div class="day_tab">'])
            monthContentHTML.push(buildCellsDay(day, month, year, styleCell, activeClasses[i]))
            monthContentHTML.push(`</div>`)
        }
    }

    monthContentHTML.push(`</div>`)

    monthContentHTML.push(`</div>`)

    monthContentHTML.push(`</div>`)

    monthBox.innerHTML = monthContentHTML.join('')
    dom.calendar.appendChild(monthBox)

    const scrollHeight = currentHour > 6 ? 8 * 66 : 0
    document.getElementById('day__content').scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
    });
}

function renderDaysHeader(day, monthIdx, year, weekDay) {
    function isCurrentDate() {
        return day === currentDate && monthIdx === currentMonth && year === currentYear
    }

    const clsDay = isCurrentDate() ? 'day_current_date accent' : 'day_current_date'
    const dayNames = []
    const dayNameTag = `<div class='day_date'>
                                <div class="view_day_day_name">${weekDaysNames[weekDay]}</div>
                                <div class="${clsDay}">${day}</div>
                            </div>
                            <div class='training_class'>
                                <div class="training_class_title">Учебный класс</div>
                           <div class="classes_block">`
    dayNames.push(dayNameTag)

    let activeClasses = selectedClasses
    if (activeClasses[0] === 'All') {
        activeClasses = activeClasses.filter(cl => cl !== 'All')
        activeClasses = [...new Set(activeClasses)]
    }

    for (let i = 0; i < activeClasses.length; i++) {

        const dayNameTag = `<div class='training_class_name_block'>
                                <div class="training_class_name">${activeClasses[i]}</div>
                            </div>`
        dayNames.push(dayNameTag)
    }

    dayNames.push(`</div></div>`)
    return dayNames.join('')
}

function buildCellsDay(presentDay, month, year, styleCell, trainingRoom) {
    const datesHTML = []
    let dateHTML

    for (let i = 0; i < 24; i++) {
        const hour = i
        let isActive = false
        if (filteredGroupsUpToFive.includes(trainingRoom)) {

            isActive = hour < 8 || hour > 17
        }
        if (filteredGroupsUpToSix.includes(trainingRoom)) {
            isActive = hour < 7 || hour > 18
        }

        dateHTML = buildCellDay(presentDay, month, year, hour, isActive, styleCell, trainingRoom)
        datesHTML.push(dateHTML)
    }

    return datesHTML.join('')
}

function buildCellDay(presentDay, month, year, hour, isActive, styleCell, trainingRoom) {
    const currentEvent = events.filter(event => {
        const el = event.date.split('-')
        const isEventDate = +el[0] === presentDay && +el[1] === (+month) && +el[2] === year
        const isTrainingRoom = event.title === trainingRoom
        if (isEventDate && isTrainingRoom) {
            const halfTotalPlaces = event.total_places / 2
            const occupied_places = event.occupied_places
            const freePlaces = event.total_places - occupied_places

            if (freePlaces === 0) return event.eventType = 'noPlaces'
            if (occupied_places > halfTotalPlaces) return event.eventType = 'fewPlaces'
            if (halfTotalPlaces > occupied_places) return event.eventType = 'manyPlaces'

            return event
        }
    })

    const clsEvent = currentEvent.length > 0 ? 'time_event' : 'no_event'
    let clsCell = !isActive ? styleCell : `${styleCell}_hour_no_active`

    if (trainingRoom === undefined) {
        trainingRoom = 'нет класса'
    }
    const cellId = `${presentDay}_${month}_${year}_${hour}_${trainingRoom}`

    return `<div class="${clsCell}" id="${cellId}"> 
                 <div class="events_container_view_week">  
                          ${currentEvent.map(event => {
        const isEventTime = +event.time === hour + 1
        const occupied_places = event.occupied_places
        const total_places = event.total_places
        if (!event.itsMyEvent && isEventTime) {
            const eventType = event.eventType
            const freePlaces = event.total_places - occupied_places
            let activeTitle

            if (eventType === 'noPlaces') {
                const color = '#E00000'
                activeTitle = `<div class="event_description " style="color :${color};"  id="${event.id}">Мест нет ${occupied_places} из ${total_places}</div>`
            }
            if (eventType === 'fewPlaces') {
                const color = '#FF8B0F'
                activeTitle = `<div class="event_description " style="color :${color};"  id="${event.id}">Есть ${freePlaces} из ${total_places}</div>`
            }
            if (eventType === 'manyPlaces') {
                const color = '#0D932B'
                activeTitle = `<div class="event_description " style="color :${color};"  id="${event.id}">Есть места ${freePlaces} из ${total_places}</div>`
            }

            return `<div class="${clsEvent} ${eventType}" id="${event.id}" >
                                     <div class="event_count_users" ${event.id}>
                                 ${activeTitle}
                                   </div>
                </div>`
        } else if (event.itsMyEvent && isEventTime) {

            return `<div class="${clsEvent}" id="${event.id}">
                                     <div  class="event_title_week" id="${event.id}">${event?.title}</div>
                                     <div class="event_count_users" ${event.id}>
                                        <img src="icons/user_icon.jpg" alt="icon" class="user_img">
                                        <div class="event_description" id="${event.id}">${occupied_places} ${declOfNumParticipant(occupied_places)}</div>
                                     </div>
                </div>`
        }
    }).join('')}
                          
                  </div>
            </div>`
}
/*DAY*/

//обработка кликов
document.addEventListener('click', function (e) {
    const incNumOptionsSelect = () => {
        $('#select_date_value').empty().trigger('change')
        numSelectYears = numSelectYears + 2
        buildSelectValues(numSelectYears)
    }

    if (e.target.id === 'next_btn') {

        if (displayedTypeCalendar === 'month') {
            if (displayedYear === currentYear + (numSelectYears / 2) && displayedMonthIdx === 11) {
                incNumOptionsSelect()
            }
            const nextMonth = () => {
                if (displayedMonthIdx === 11) {
                    const firstMonthIdx = 0
                    const nextYear = displayedYear + 1
                    displayedMonthIdx = firstMonthIdx
                    displayedYear = nextYear
                } else {
                    displayedMonthIdx++
                }
                return displayedMonthIdx
            }

            renderMonth(nextMonth(), displayedYear)
            activeSelectMonth(displayedMonthIdx, displayedYear)
        }

        if (displayedTypeCalendar === 'week') {
            displayedDay += 7

            const displayedMonthDays = months[displayedMonthIdx].days
            const date = new Date(displayedYear, displayedMonthIdx + 1)
            let startDateWeekDay = date.getDay()
            startDateWeekDay = startDateWeekDay === 0 ? 7 : startDateWeekDay

            if (displayedDay > displayedMonthDays || (displayedDay + startDateWeekDay) > displayedMonthDays) {

                if (displayedYear > currentYear + (numSelectYears / 2)) {
                    displayedYear -= 1
                }
                if (displayedYear === currentYear + (numSelectYears / 2) && displayedMonthIdx === 11) {
                    incNumOptionsSelect()
                }

                if (displayedMonthIdx === 11
                    && (displayedDay > displayedMonthDays
                        || (displayedDay + startDateWeekDay) > displayedMonthDays)) {
                    displayedYear = displayedYear + 1
                }


                if (displayedDay > displayedMonthDays) {
                    displayedDay = displayedDay - displayedMonthDays
                } else {
                    displayedDay = 1
                }

                displayedMonthIdx = displayedMonthIdx >= 11 ? 0 : displayedMonthIdx + 1
                activeSelectMonth(displayedMonthIdx, displayedYear)
            }

            renderWeek(displayedDay, displayedMonthIdx, 'next')
        }
        if (displayedTypeCalendar === 'day') {
            const month = displayedMonthIdx + 1
            const monthLength = daysInMonth(month, displayedYear)

            displayedDay += 1
            if (displayedDay > monthLength) {
                displayedMonthIdx += 1

                if (displayedMonthIdx > 11) {
                    if (displayedYear === currentYear + (numSelectYears / 2)) {
                        incNumOptionsSelect()
                    }
                    displayedMonthIdx = 0
                    displayedYear += 1
                }
                displayedDay = 1
                activeSelectMonth(displayedMonthIdx, displayedYear)
            }
            renderDay(displayedMonthIdx, displayedYear, displayedDay)
        }
    }

    if (e.target.id === 'prev_btn') {
        if (displayedTypeCalendar === 'month') {
            if (displayedYear === currentYear - (numSelectYears / 2) && displayedMonthIdx === 0) {
                incNumOptionsSelect()
            }
            const prevMonth = () => {
                if (displayedMonthIdx === 0) {
                    const firstMonthIdx = 11
                    const prevYear = displayedYear - 1
                    displayedMonthIdx = firstMonthIdx
                    displayedYear = prevYear
                } else {
                    displayedMonthIdx--
                }
                return displayedMonthIdx
            };

            renderMonth(prevMonth(), displayedYear)
            activeSelectMonth(displayedMonthIdx, displayedYear)
        }
        if (displayedTypeCalendar === 'week') {
            displayedDay -= 7

            const displayedMonthDays = displayedMonthIdx === 0 ? months[11].days : months[displayedMonthIdx - 1].days

            if (displayedDay <= 0) {
                isChangedMonth = true
                if (displayedYear < currentYear - (numSelectYears / 2)) {
                    displayedYear += 1
                }
                if (displayedYear === currentYear - (numSelectYears / 2) && displayedMonthIdx === 0) {
                    incNumOptionsSelect()
                }
                if (displayedMonthIdx === 0 && displayedDay <= 0) {
                    displayedYear = displayedYear - 1
                }
                displayedDay = displayedMonthDays + displayedDay
                displayedMonthIdx = displayedMonthIdx <= 0 ? 11 : displayedMonthIdx - 1
                activeSelectMonth(displayedMonthIdx, displayedYear)
            }

            renderWeek(displayedDay, displayedMonthIdx, 'prev')
        }
        if (displayedTypeCalendar === 'day') {
            const monthLength = daysInMonth(displayedMonthIdx, displayedYear)
            displayedDay -= 1
            if (displayedDay <= 0) {
                displayedMonthIdx -= 1
                if (displayedMonthIdx < 0) {
                    if (displayedYear === currentYear - (numSelectYears / 2)) {
                        incNumOptionsSelect()
                    }
                    displayedMonthIdx = 11
                    displayedYear -= 1
                }
                displayedDay = monthLength
                activeSelectMonth(displayedMonthIdx, displayedYear)
            }
            renderDay(displayedMonthIdx, displayedYear, displayedDay)
        }
    }
    if (e.target.id === 'today_btn') {
        displayedMonthIdx = currentMonth
        displayedYear = currentYear
        displayedDay = currentDate

        if (displayedTypeCalendar === 'week') {
            renderWeek(currentDate, currentMonth)
        }
        if (displayedTypeCalendar === 'month') {
            renderMonth(currentMonth, currentYear)
        }
        if (displayedTypeCalendar === 'day') {
            renderDay(currentMonth, currentYear, currentDate)
        }

        activeSelectMonth(displayedMonthIdx, displayedYear)
    }


    if (e.target.id === 'week_btn') {
        displayedTypeCalendar = 'week'
        activeBtn('week_btn')
        displayedDay = displayedMonthIdx === currentMonth && displayedYear === currentYear ? currentDate : 1
        displayedDay === currentDate && currentMonth === displayedMonthIdx && displayedYear === currentYear ?
            renderWeek(currentDate, displayedMonthIdx) : renderWeek(displayedDay, displayedMonthIdx)
    }

    if (e.target.id === 'month_btn') {
        displayedTypeCalendar = 'month'
        activeBtn('month_btn')
        renderMonth(displayedMonthIdx, displayedYear)
    }

    if (e.target.id === 'day_btn') {
        displayedTypeCalendar = 'day'
        displayedDay = displayedMonthIdx === currentMonth && displayedYear === currentYear ? currentDate : 1
        activeBtn('day_btn')
        renderDay(displayedMonthIdx, displayedYear, displayedDay)
    }

    if (e.target.closest('.month_date')) {
        const eventId = e.target.id
        const currentEvent = events.filter(event => event.id === eventId)[0]
        if (isPastDate(eventId)) {
            currentEvent === undefined && alert(`Модалка создания: ${eventId}`)
        }
        !!currentEvent && alert(`Модалка редактирования: ${eventId}`)
    }

    if (e.target.closest('.week_date_hours')) {
        const eventId = e.target.id;
        const currentEvent = events.filter(event => event.id === eventId)[0]
        if (isPastDate(eventId)) {
            currentEvent === undefined && alert(`Модалка создания: ${eventId}`)
        }
        !!currentEvent && alert(`Модалка редактирования: ${eventId}`)
    }

    if (e.target.closest('.day_date_hours')) {
        const eventId = e.target.id;
        const currentEvent = events.filter(event => event.id === eventId)[0]
        if (isPastDate(eventId)) {
            currentEvent === undefined && alert(`Модалка создания: ${eventId}`)
        }
        !!currentEvent && alert(`Модалка редактирования: ${eventId}`)
    }

    if (e.target.closest('.form-control-date')) {

        renderDatePicker(displayedMonthDatePickerIdx, currentYear)
        buildMonthSelectDatePicker(currentYear, displayedMonthDatePickerIdx)
        document.getElementsByClassName('date_picker')[0].style = 'display:block;';
        document.getElementsByClassName('month_date_picker_content')[0].style = 'display:block;z-index:2';
    }

    if (e.target.closest('.date_date_picker')) {
        const dateId = e.target.id
        const values = dateId.split('_')
        const day = +values[0]
        const month = +values[1]
        const year = +values[2]

        document.getElementById('input_date_picket').value = `${day}/${month}/${year}`

        $('.form_date').each(function () {
            $(this).closest('.form-group').addClass('focused', !this.value);
        });

        displayedDay = day
        displayedMonthIdx = month - 1
        displayedYear = year

        if (displayedTypeCalendar === 'day') {
            renderDay(displayedMonthIdx, displayedYear, displayedDay)
        }

        if (displayedTypeCalendar === 'week') {
            renderWeek(displayedDay, displayedMonthIdx)
        }

        if (displayedTypeCalendar === 'month') {
            renderMonth(displayedMonthIdx, displayedYear)
        }

        activeSelectMonth(displayedMonthIdx, displayedYear)
    }

    if (e.target.closest('.prev_date_picker_btn')) {
        displayedMonthDatePickerIdx -= 1
        if (displayedMonthDatePickerIdx < 0) {
            displayedMonthDatePickerIdx = 11
        }

        activeSelectMonthDatePicker(displayedMonthDatePickerIdx, currentYear)
        renderDatePicker(displayedMonthDatePickerIdx, currentYear)
    }

    if (e.target.closest('.next_date_picker_btn')) {
        displayedMonthDatePickerIdx += 1
        if (displayedMonthDatePickerIdx > 11) {
            displayedMonthDatePickerIdx = 0
        }

        activeSelectMonthDatePicker(displayedMonthDatePickerIdx, currentYear)
        renderDatePicker(displayedMonthDatePickerIdx, currentYear)

    }
    //Закрытие окна выбора дыты при клике вне поля
    document.onclick =
        function (e) {
            if ($(e.target).closest('.form_date').length) {
                // клик внутри элемента
                return;
            }
            // клик снаружи элемента
            $('.date_picker').fadeOut()
        }

    renderDatePicker(displayedMonthDatePickerIdx, currentYear)
    buildMonthSelectDatePicker(currentYear, displayedMonthDatePickerIdx)
});

renderDatePicker(displayedMonthDatePickerIdx, currentYear)
buildMonthSelectDatePicker(currentYear, displayedMonthDatePickerIdx)

//выбор даты
function renderDatePicker(monthIdx, year) {
    let container = document.getElementById('month_block_picker'),
        cTable = document.createElement('table')
    container.innerHTML = ''
    container.appendChild(cTable)

    const month = months[monthIdx]
    const monthContentHTML = []
    const monthBox = document.createElement('div')

    monthContentHTML.push(['<div class="date_picker_cells">'])
    monthContentHTML.push(renderWeekDaysNamesDatePicker())
    monthContentHTML.push(buildDatesDatePicker(year, monthIdx, month.days))
    monthContentHTML.push(`</div>`)

    monthBox.innerHTML = monthContentHTML.join('')
    dom.datePicker.appendChild(monthBox)

}

function renderWeekDaysNamesDatePicker() {
    const dayNames = []
    for (let i = 0; i < 7; i++) {
        const dayNameTag = `<div class='month_date_date_picker'>
                                <div class="week_day_name_date_picker">${weekDaysNames[i]}</div>
                            </div>`
        dayNames.push(dayNameTag)
    }
    return dayNames.join('')
}

function buildDatesDatePicker(year, month, daysCount) {
    const date = new Date(year, month, 1)
    const datesHTML = []
    const weekDayStart = date.getDay()

    const monthStart = date.getMonth()
    const prevMonthsDays = () => {
        if (monthStart === 0) {
            return months[11].days
        } else {
            return months[monthStart - 1].days
        }
    }
    const corrector = weekDayStart === 0 ? 5 : weekDayStart - 2
    let prevMonthDayStart = prevMonthsDays() - corrector
    let nextMonthDayStart = 1

    const daysInWeek = 7
    let firstDayWeekIdx = 1
    let firstDayMonth = 1
    let currentCellsNum = 0
    let cellsNum = 42
    let dateHTML

    while (firstDayMonth <= daysCount) {
        if (firstDayWeekIdx < weekDayStart || weekDayStart === 0 && firstDayWeekIdx < daysInWeek) {
            dateHTML = buildDateDatePicker(prevMonthDayStart, month - 1, year, true)
            datesHTML.push(dateHTML)
            currentCellsNum++
            prevMonthDayStart++
            firstDayWeekIdx++
        } else {
            dateHTML = buildDateDatePicker(firstDayMonth, month, year)
            datesHTML.push(dateHTML)
            currentCellsNum++
            firstDayMonth++
        }
    }

    while (currentCellsNum < cellsNum) {
        dateHTML = buildDateDatePicker(nextMonthDayStart, month + 1, year, true)
        datesHTML.push(dateHTML)
        currentCellsNum++
        nextMonthDayStart++
    }

    return datesHTML.join('')
}

function buildDateDatePicker(content, month, year, isAccent) {
    const isCurrentDate = content === currentDate && month === currentMonth && year === currentYear
    const processedMonth = month + 1
    const cellId = `${content}_${processedMonth}_${year}`
    const clsDate = isAccent ? 'date_date_picker_dis' : 'date_date_picker'

    return isCurrentDate
        ? `<div class=" ${clsDate} current_date" id="${cellId}">${content} </div>`
        : `<div class=" ${clsDate}" id="${cellId}">${content} </div>`
}

function buildMonthSelectDatePicker(year, month) {
    $('#select_date_date_picker_value').empty().trigger('change')
    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        let opt = document.createElement('option');
        opt.className = 'option_date_picker'

        opt.value = `${monthIdx}_${year}`;
        opt.year = year;
        opt.monthIdx = monthIdx;
        opt.innerHTML = months[monthIdx].name + ', ' + year;
        if (monthIdx === month && year === currentYear) {
            opt.selected = true;
        }
        document.getElementById('select_date_date_picker_value').appendChild(opt)
    }
}

function activeSelectMonthDatePicker(monthIdx, year) {
    displayedMonthDatePickerIdx = monthIdx
    const value = `${monthIdx}_${year}`
    $('#select_date_date_picker_value').val(value).trigger('change')

}

$('#select_date_date_picker_value').on('select2:select', function (e) {
    let data = e.params.data;
    displayedMonthDatePickerIdx = data.element.monthIdx
    const year = data.element.year
    activeSelectMonthDatePicker(displayedMonthDatePickerIdx, year)
    renderDatePicker(displayedMonthDatePickerIdx, year)
});
//выбор даты

/*Селектор городов*/
function buildCitiesSelect() {

    for (let i = 0; i < cities.length; i++) {
        let opt = document.createElement('option');
        opt.value = `${cities[i]}`;
        opt.innerHTML = cities[i]
        document.getElementById('floating-select').appendChild(opt)
    }
}

buildCitiesSelect()

$('#floating-select').on('change', function (e) {
    selectedCities = $(this).val()
    filtration(true)
})
/*Селектор городов*/

/*Селектор классов*/
function buildClassesSelect(label, opts) {

    let optGroupLabel = document.createElement('optgroup');
    optGroupLabel.label = label;
    document.getElementById('select_classes').appendChild(optGroupLabel)
    for (let i = 0; i < opts.length; i++) {
        let opt = document.createElement('option');
        opt.value = `${opts[i]}`;
        opt.innerHTML = opts[i]
        $('#select_classes').append(opt);
    }
}

function makeOptions() {
    $('#select_classes').empty();
    const optAll = document.createElement('option');
    optAll.className = 'opt_all'
    optAll.value = `All`;
    optAll.innerHTML = 'Все'
    document.getElementById('select_classes').appendChild(optAll)

    if (filteredGroupsUpToFive.length > 0) {
        buildClassesSelect('08:00-17:00', filteredGroupsUpToFive)
    }
    if (filteredGroupsUpToSix.length > 0) {
        buildClassesSelect('07:00-18:00', filteredGroupsUpToSix)
    }
    if (filteredGroupsAllTime.length > 0) {
        buildClassesSelect('24/7', filteredGroupsAllTime)
    }
}

$('#select_classes').on('change', function (e) {
    selectedClasses = $(this).val()
    let allSelectedClasses = selectedClasses.concat(filteredGroupsUpToFive).concat(filteredGroupsUpToSix).concat(filteredGroupsAllTime)

    if (selectedClasses[0] === 'All') {

        selectedClasses = allSelectedClasses
        activeSelectClasses()
    }

    filtration(false)
})

function activeSelectClasses() {
    $('#select_classes').val([...selectedClasses]).trigger('change.select2');
}
/*Селектор классов*/

/*Селектор выбора месяца управление календарем*/
$('#select_date_value').on('select2:select', function (e) {
    let data = e.params.data;
    displayedMonthIdx = data.element.monthIdx
    displayedYear = data.element.year
    if (displayedTypeCalendar === 'week') {
        const date = new Date(displayedYear, displayedMonthIdx)
        let startDateWeekDay = date.getDay()

        if (startDateWeekDay !== 1) {
            let iterations = 1
            while (startDateWeekDay !== 1) {
                startDateWeekDay++
                if (startDateWeekDay > 6) {
                    startDateWeekDay = 0
                }
                iterations++
            }
            displayedDay = iterations
        }

        renderWeek(displayedDay, displayedMonthIdx)

    }

    if (displayedTypeCalendar === 'month') {
        renderMonth(displayedMonthIdx, displayedYear)
    }

    if (displayedTypeCalendar === 'day') {
        displayedDay = 1
        renderDay(displayedMonthIdx, displayedYear, displayedDay)
    }
    renderDatePicker(displayedMonthDatePickerIdx, currentYear)
    buildMonthSelectDatePicker(currentYear, displayedMonthDatePickerIdx)
});

function activeSelectMonth(monthIdx, year) {
    const value = `${monthIdx}_${year}`
    $('#select_date_value').val(value).trigger('change');
}

function buildMonthSelect(year) {
    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        let opt = document.createElement('option');
        opt.value = `${monthIdx}_${year}`;
        opt.year = year;
        opt.monthIdx = monthIdx;
        opt.innerHTML = months[monthIdx].name + ' ' + year;
        if (monthIdx === displayedMonthIdx && year === currentYear) {
            opt.selected = true;
        }
        document.getElementById('select_date_value').appendChild(opt)
    }
}

function buildSelectValues(yearsNum) {
    let yearStart = currentYear - (yearsNum / 2)
    for (let yearIdx = 0; yearIdx <= yearsNum; yearIdx++) {
        buildMonthSelect(yearStart)
        yearStart++
    }
}

buildSelectValues(numSelectYears)

/*Селектор выбора месяца управление календарем*/
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function checkAddress(checkbox) {
    const checkboxId = checkbox.id

    if (checkboxId === 'checked_my') {
        checkbox.checked ? checkedMy = true : checkedMy = false
    }
    if (checkboxId === 'checked_free') {
        checkbox.checked ? checkedFree = true : checkedFree = false
    }
    filtration()
}


function isPastDate(eventId) {
    const selectedDates = eventId.split('_')
    const year = +selectedDates[2]
    const monthIdx = +selectedDates[1] - 1
    const day = +selectedDates[0]
    let isPastMonths = true
    if (year === currentYear && monthIdx === currentMonth && day < currentDate) {
        isPastMonths = false
    }
    if (year === currentYear && monthIdx < currentMonth) {
        isPastMonths = false
    }
    if (year !== currentYear) {
        isPastMonths = false
    }
    return isPastMonths
}

//Активная кнопка выбора календаря
function activeBtn(activeClass) {
    const buttons = ['day_btn', 'week_btn', 'month_btn']
    const removedActive = buttons.filter((btn) => btn !== activeClass)

    document.getElementById(activeClass).classList.add('active')
    document.getElementById(removedActive[0]).classList.remove('active')
    document.getElementById(removedActive[1]).classList.remove('active')
}
//Активная кнопка выбора календаря

function declOfNumParticipant(n) {
    let text_forms = ['участник', 'участника', 'участников']
    n = Math.abs(n) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) {
        return text_forms[2];
    }
    if (n1 > 1 && n1 < 5) {
        return text_forms[1];
    }
    if (n1 == 1) {
        return text_forms[0];
    }
    return text_forms[2];
}

function handleToDayBtn(day, monthIdx, year) {
    const isCurrentDate = currentDate === day && currentMonth === monthIdx && currentYear === year
    if (isCurrentDate) {
        dom.todayBtn.setAttribute('disabled', 'true');
        document.getElementsByClassName('today_btn')[0].style = 'opacity:.5';
    } else {
        dom.todayBtn.removeAttribute('disabled');
        document.getElementsByClassName('today_btn')[0].style = 'opacity:1';
    }
}

