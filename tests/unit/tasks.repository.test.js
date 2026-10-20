const TaskRepository = require('../../src/tasks.repository');

describe('TaskRepository', () => {
  let repo;
  beforeEach(() => { repo = new TaskRepository(null); });

  test('crea tareas con id incremental', () => {
    const a = repo.create('Estudiar Jenkins');
    const b = repo.create('Configurar Sonar');
    expect(a.id).toBe(1);
    expect(b.id).toBe(2);
    expect(a.done).toBe(false);
  });

  test('rechaza títulos cortos', () => {
    expect(() => repo.create('ab')).toThrow('al menos 3');
  });

  test('alterna el estado y filtra', () => {
    const t = repo.create('Hacer el deber');
    repo.toggle(t.id);
    expect(repo.list('done')).toHaveLength(1);
    expect(repo.list('pending')).toHaveLength(0);
  });

  test('elimina y devuelve false si no existe', () => {
    const t = repo.create('Borrar esto');
    expect(repo.remove(t.id)).toBe(true);
    expect(repo.remove(999)).toBe(false);
  });
});
