describe('addEmployee - nombre vacío', () => {
  it('El test no permitirá que el nombre esté vacio', () => {
    cy.visit('http://localhost:4200/addemployee/');    

    cy.get('.btn').click();
    
    cy.get('.toast-message').should('contain.text', 'El nombre no puede estar vacio.');
  });
});
