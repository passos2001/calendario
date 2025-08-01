const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");
const calendar = document.getElementById("calendar");

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function populateSelectors() {
    for (let i = 0; i < 12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = monthNames[i];
        monthSelect.appendChild(option);
    }

    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
        const option = document.createElement("option");
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    // Set defaults
    monthSelect.value = new Date().getMonth();
    yearSelect.value = new Date().getFullYear();
}

function generateCalendar(month, year) {
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const key = `markedDays-${year}`;
    const markedDays = JSON.parse(localStorage.getItem(key)) || {};

    // Encabezados de días
    for (const dayName of dayNames) {
        const header = document.createElement("div");
        header.className = "day-name";
        header.textContent = dayName;
        calendar.appendChild(header);
    }

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfYear = getDayOfYear(date);
        const dayId = `${month + 1}-${day}`; // e.g. "1-2" for 2 de enero

        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        if (markedDays[dayId]) dayDiv.classList.add("marked");

        dayDiv.innerHTML = `
          <div class="day-number">${day}</div>
          <div class="day-of-year">Día ${dayOfYear}</div>
        `;

        dayDiv.addEventListener("click", () => {
            dayDiv.classList.toggle("marked");
            if (markedDays[dayId]) {
                delete markedDays[dayId];
            } else {
                markedDays[dayId] = true;
            }
            localStorage.setItem(key, JSON.stringify(markedDays));
        });

        calendar.appendChild(dayDiv);
    }
}

// Inicialización
populateSelectors();
generateCalendar(Number(monthSelect.value), Number(yearSelect.value));

monthSelect.addEventListener("change", () => {
    generateCalendar(Number(monthSelect.value), Number(yearSelect.value));
});

yearSelect.addEventListener("change", () => {
    generateCalendar(Number(monthSelect.value), Number(yearSelect.value));
});