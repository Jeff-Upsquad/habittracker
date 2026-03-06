const STORAGE_KEY = "grid-habits-v1";
const WEEKS = 30;

const state = {
  habits: [],
  selectedHabitId: null,
};

const els = {
  habitForm: document.querySelector("#habit-form"),
  habitInput: document.querySelector("#habit-input"),
  habitList: document.querySelector("#habit-list"),
  title: document.querySelector("#habit-title"),
  markToday: document.querySelector("#mark-today"),
  monthLabels: document.querySelector("#month-labels"),
  habitGrid: document.querySelector("#habit-grid"),
  totalDays: document.querySelector("#total-days"),
  currentStreak: document.querySelector("#current-streak"),
  bestStreak: document.querySelector("#best-streak"),
};

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(key) {
  return new Date(`${key}T00:00:00`);
}

function buildTimeline() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));

  return Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function loadState() {
  const fromStorage = localStorage.getItem(STORAGE_KEY);

  if (!fromStorage) {
    state.habits = [{ id: crypto.randomUUID(), name: "Working out", dates: [] }];
    state.selectedHabitId = state.habits[0].id;
    return;
  }

  const parsed = JSON.parse(fromStorage);
  state.habits = Array.isArray(parsed.habits) ? parsed.habits : [];
  state.selectedHabitId = parsed.selectedHabitId ?? state.habits[0]?.id ?? null;
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ habits: state.habits, selectedHabitId: state.selectedHabitId })
  );
}

function selectedHabit() {
  return state.habits.find((habit) => habit.id === state.selectedHabitId) ?? null;
}

function addHabit(name) {
  const habit = {
    id: crypto.randomUUID(),
    name,
    dates: [],
  };

  state.habits.unshift(habit);
  state.selectedHabitId = habit.id;
  persistState();
  render();
}

function toggleDateForHabit(habit, key) {
  const set = new Set(habit.dates);
  if (set.has(key)) {
    set.delete(key);
  } else {
    set.add(key);
  }
  habit.dates = [...set].sort();
}

function calcStreaks(habit) {
  if (!habit || habit.dates.length === 0) {
    return { current: 0, best: 0, total: 0 };
  }

  const sortedDates = habit.dates.map(parseDate).sort((a, b) => a - b);
  let best = 1;
  let current = 1;

  for (let i = 1; i < sortedDates.length; i += 1) {
    const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = sortedDates[sortedDates.length - 1];
  const gap = (today - lastDate) / (1000 * 60 * 60 * 24);

  if (gap > 1) {
    current = 0;
  } else if (gap === 1) {
    current = 1;
    for (let i = sortedDates.length - 1; i > 0; i -= 1) {
      const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current += 1;
      } else {
        break;
      }
    }
  }

  return {
    current,
    best,
    total: habit.dates.length,
  };
}

function renderHabitList() {
  els.habitList.innerHTML = "";

  state.habits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = `habit-item${habit.id === state.selectedHabitId ? " active" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = habit.name;
    button.addEventListener("click", () => {
      state.selectedHabitId = habit.id;
      persistState();
      render();
    });

    li.append(button);
    els.habitList.append(li);
  });
}

function renderMonths(timeline) {
  els.monthLabels.innerHTML = "";

  const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "short" });
  let lastMonth = "";

  for (let col = 0; col < WEEKS; col += 1) {
    const firstCellDate = timeline[col * 7];
    const month = monthFormatter.format(firstCellDate);

    const label = document.createElement("span");
    label.textContent = month !== lastMonth ? month : "";
    label.style.textAlign = "left";
    els.monthLabels.append(label);

    lastMonth = month;
  }
}

function renderGrid(habit, timeline) {
  els.habitGrid.innerHTML = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const done = new Set(habit?.dates ?? []);

  for (let col = 0; col < WEEKS; col += 1) {
    for (let row = 0; row < 7; row += 1) {
      const date = timeline[col * 7 + row];
      const key = dateKey(date);

      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.title = `${key}`;

      if (date > today) {
        cell.classList.add("future");
        cell.disabled = true;
      }

      if (done.has(key)) {
        cell.classList.add("done");
      }

      if (key === dateKey(today)) {
        cell.classList.add("today");
      }

      cell.addEventListener("click", () => {
        if (!habit || date > today) return;
        toggleDateForHabit(habit, key);
        persistState();
        render();
      });

      els.habitGrid.append(cell);
    }
  }
}

function renderStats(habit) {
  const stats = calcStreaks(habit);
  els.totalDays.textContent = `${stats.total}`;
  els.currentStreak.textContent = `${stats.current}`;
  els.bestStreak.textContent = `${stats.best}`;
}

function render() {
  const habit = selectedHabit();
  const timeline = buildTimeline();

  renderHabitList();
  renderMonths(timeline);
  renderGrid(habit, timeline);
  renderStats(habit);

  els.title.textContent = habit ? `${habit.name}!` : "Select a habit";
  els.markToday.disabled = !habit;
}

els.habitForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = els.habitInput.value.trim();
  if (!name) return;
  addHabit(name);
  els.habitInput.value = "";
  els.habitInput.focus();
});

els.markToday.addEventListener("click", () => {
  const habit = selectedHabit();
  if (!habit) return;
  toggleDateForHabit(habit, dateKey(new Date()));
  persistState();
  render();
});

loadState();
render();
