const list = document.getElementById('task-list');
const form = document.getElementById('task-form');
const input = document.getElementById('title');
const error = document.getElementById('error');

async function load() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  list.innerHTML = '';
  tasks.forEach((t) => {
    const li = document.createElement('li');
    li.dataset.cy = 'task';
    li.className = t.done ? 'done' : '';
    li.textContent = t.title;

    const toggle = document.createElement('button');
    toggle.textContent = t.done ? 'Reabrir' : 'Completar';
    toggle.onclick = async () => {
      await fetch(`/api/tasks/${t.id}/toggle`, { method: 'PATCH' });
      load();
    };

    const del = document.createElement('button');
    del.textContent = 'Eliminar';
    del.onclick = async () => {
      await fetch(`/api/tasks/${t.id}`, { method: 'DELETE' });
      load();
    };

    li.append(' ', toggle, ' ', del);
    list.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value }),
  });
  error.textContent = res.ok ? '' : (await res.json()).error;
  input.value = '';
  load();
});

load();
