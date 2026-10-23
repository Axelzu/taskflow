const list = document.getElementById('task-list');
const form = document.getElementById('task-form');
const input = document.getElementById('title');
const error = document.getElementById('error');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('[data-filter]');

let currentFilter = '';

function renderTask(t) {
  const li = document.createElement('li');
  li.dataset.cy = 'task';
  li.className = t.done ? 'task done' : 'task';

  const info = document.createElement('div');
  info.className = 'task-info';
  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = t.title;
  const date = document.createElement('span');
  date.className = 'task-date';
  date.textContent = 'Creada el ' + new Date(t.createdAt).toLocaleDateString('es-EC');
  info.append(title, date);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const toggle = document.createElement('button');
  toggle.className = 'btn-toggle';
  toggle.textContent = t.done ? 'Reabrir' : 'Completar';
  toggle.onclick = async () => {
    await fetch(`/api/tasks/${t.id}/toggle`, { method: 'PATCH' });
    void load();
  };

  const del = document.createElement('button');
  del.className = 'btn-delete';
  del.textContent = 'Eliminar';
  del.onclick = async () => {
    await fetch(`/api/tasks/${t.id}`, { method: 'DELETE' });
    void load();
  };

  actions.append(toggle, del);
  li.append(info, actions);
  return li;
}

async function load() {
  const query = currentFilter ? `?status=${currentFilter}` : '';
  const tasks = await (await fetch(`/api/tasks${query}`)).json();

  list.innerHTML = '';
  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No hay tareas en esta vista';
    list.appendChild(empty);
  } else {
    tasks.forEach((t) => list.appendChild(renderTask(t)));
  }

  const pending = await (await fetch('/api/tasks?status=pending')).json();
  counter.textContent = `${pending.length} pendiente(s)`;
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle('active', b === btn));
    void load();
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value }),
  });
  error.textContent = res.ok ? '' : (await res.json()).error;
  input.value = '';
  void load();
});

void load();
