const path = require('path');
const createApp = require('./app');
const TaskRepository = require('./tasks.repository');

const PORT = process.env.PORT || 3000;
const dataFile = process.env.DATA_FILE || path.join(__dirname, '..', 'data', 'tasks.json');

createApp(new TaskRepository(dataFile)).listen(PORT, () => {
  console.log(`TaskNest en http://localhost:${PORT}`);
});
