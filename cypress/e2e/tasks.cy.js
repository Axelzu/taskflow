describe('TaskNest E2E', () => {
  it('crea y completa una tarea', () => {
    const title = `Tarea E2E ${Date.now()}`;
    cy.visit('/');
    cy.get('#title').type(title);
    cy.get('#task-form').submit();
    cy.contains('[data-cy=task]', title).within(() => {
      cy.contains('button', 'Completar').click();
    });
    cy.contains('[data-cy=task]', title).should('have.class', 'done');
  });

  it('muestra un error con un título corto', () => {
    cy.visit('/');
    cy.get('#title').type('ab');
    cy.get('#task-form').submit();
    cy.get('#error').should('contain', 'al menos 3');
  });
});
