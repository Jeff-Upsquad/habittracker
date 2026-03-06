const STORAGE_KEY = "grid-habit-tracker-v1";
const WEEKS = 52;
const DAYS = 7;
const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const habitForm = document.querySelector("#habit-form");
const habitNameInput = document.querySelector("#habit-name");
const habitsContainer = document.querySelector("#habits");
const habitTemplate = document.querySelector("#habit-template");

const todayIndex = getTodayCellIndex();
let habits = loadHabits();
renderHabits();

habitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = habitNameInput.value.trim();
  if (!name) return;

  habits.unshift(createHabit(name));
  saveHabits();
  renderHabits();
  habitForm.reset();
  habitNameInput.focus();
});

function createHabit(name) {
  return {
    id: crypto.randomUUID(),
    name,
    completed: [],
    goal: 3,
  };
}

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [createHabit("Working out 🏋️")];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      return [createHabit("Working out 🏋️")];
    }
    return parsed.map((habit) => ({
      id: habit.id || crypto.randomUUID(),
      name: habit.name || "Habit",
      completed: Array.isArray(habit.completed) ? habit.completed.filter(isValidCell) : [],
      goal: [3, 4, 5, 7].includes(Number(habit.goal)) ? Number(habit.goal) : 3,
    }));
  } catch {
    return [createHabit("Working out 🏋️")];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function renderHabits() {
  habitsContainer.textContent = "";

  habits.forEach((habit) => {
    const card = habitTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = habit.id;

    card.querySelector(".habit-title").textContent = habit.name;
    drawMonths(card.querySelector(".months-row"));
    drawWeekdayLabels(card.querySelector(".weekday-labels"));
    drawCells(card.querySelector(".cells"), habit);

    const goalSelect = card.querySelector(".goal-select");
    goalSelect.value = String(habit.goal);
    goalSelect.addEventListener("change", (event) => {
      habit.goal = Number(event.target.value);
      saveHabits();
    });

    card.querySelector(".mark-today").addEventListener("click", () => {
      toggleCell(habit, todayIndex);
      saveHabits();
      renderHabits();
    });

    applyStats(card, habit);

    habitsContainer.append(card);
  });
}

function drawMonths(container) {
  container.textContent = "";
  for (let i = 0; i < 12; i += 1) {
    const month = document.createElement("span");
    month.textContent = MONTH_NAMES[i];
    container.append(month);
  }
}

function drawWeekdayLabels(container) {
  container.textContent = "";
  WEEKDAY_LABELS.forEach((label) => {
    const entry = document.createElement("span");
    entry.textContent = label;
    container.append(entry);
  });
}

function drawCells(container, habit) {
  container.textContent = "";
  const completed = new Set(habit.completed);

  for (let day = 0; day < DAYS; day += 1) {
    for (let week = 0; week < WEEKS; week += 1) {
      const index = day * WEEKS + week;
      const button = document.createElement("button");
      button.className = "cell";
      button.type = "button";
      button.setAttribute("aria-label", `Toggle day ${index + 1}`);
      button.style.gridColumn = String(week + 1);
      button.style.gridRow = String(day + 1);

      if (completed.has(index)) {
        button.classList.add("done");
      }

      if (index === todayIndex) {
        button.classList.add("today");
      }

      button.addEventListener("click", () => {
        toggleCell(habit, index);
        saveHabits();
        renderHabits();
      });

      container.append(button);
    }
  }
}

function toggleCell(habit, index) {
  const set = new Set(habit.completed);
  if (set.has(index)) {
    set.delete(index);
  } else {
    set.add(index);
  }
  habit.completed = [...set].sort((a, b) => a - b);
}

function applyStats(card, habit) {
  const total = habit.completed.length;
  const current = computeCurrentStreak(habit.completed);
  const best = computeBestStreak(habit.completed);

  card.querySelector(".total-days").textContent = String(total);
  card.querySelector(".current-streak").textContent = String(current);
  card.querySelector(".best-streak").textContent = String(best);
}

function computeCurrentStreak(completed) {
  const set = new Set(completed);
  let streak = 0;
  let pointer = todayIndex;

  while (pointer >= 0 && set.has(pointer)) {
    streak += 1;
    pointer -= 1;
  }

  return streak;
}

function computeBestStreak(completed) {
  const sorted = [...completed].sort((a, b) => a - b);
  if (!sorted.length) return 0;

  let best = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i] === sorted[i - 1] + 1) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }

  return best;
}

function getTodayCellIndex() {
  const now = new Date();
  const week = Math.min(WEEKS - 1, getWeekOfYear(now) - 1);
  const day = (now.getDay() + 6) % 7;
  return day * WEEKS + week;
}

function getWeekOfYear(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / 86400000);
  return Math.ceil((dayOfYear + firstDay.getDay() + 1) / 7);
}

function isValidCell(value) {
  return Number.isInteger(value) && value >= 0 && value < DAYS * WEEKS;
}
