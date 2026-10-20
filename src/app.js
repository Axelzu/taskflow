const express = require('express');
const path = require('path');

function createApp(repo) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/api/tasks', (req, res) => res.json(repo.list(req.query.status)));

  app.post('/api/tasks', (req, res) => {
    try {
      res.status(201).json(repo.create(req.body.title));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/tasks/:id/toggle', (req, res) => {
    const task = repo.toggle(Number(req.params.id));
    return task ? res.json(task) : res.status(404).json({ error: 'No existe' });
  });

  app.delete('/api/tasks/:id', (req, res) => {
    return repo.remove(Number(req.params.id))
      ? res.status(204).end()
      : res.status(404).json({ error: 'No existe' });
  });

  return app;
}

module.exports = createApp;
