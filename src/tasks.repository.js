const fs = require('fs');
const path = require('path');

class TaskRepository {
  constructor(file) {
    this.file = file;
    this.tasks = [];
    this.nextId = 1;
    if (file && fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      this.tasks = data.tasks || [];
      this.nextId = data.nextId || 1;
    }
  }

  save() {
    if (!this.file) return;
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify({ tasks: this.tasks, nextId: this.nextId }, null, 2));
  }

  list(status) {
    if (!status) return this.tasks;
    return this.tasks.filter((t) => (status === 'done' ? t.done : !t.done));
  }

  create(title) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres');
    }
    const task = { id: this.nextId++, title: title.trim(), done: false, createdAt: new Date().toISOString() };
    this.tasks.push(task);
    this.save();
    return task;
  }

  toggle(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    task.done = !task.done;
    this.save();
    return task;
  }

  remove(id) {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.save();
    return this.tasks.length < before;
  }
}

module.exports = TaskRepository;
