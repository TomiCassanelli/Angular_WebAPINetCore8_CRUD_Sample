describe('addEmployee - contiene números', () => {
  it('El test no permitirá que el nombre posea numeros', () => {
    cy.visit('http://localhost:4200/addemployee/');
    
    cy.get('.form-control').type('T');
    
    cy.get('.btn').click();
    cy.get('.btn').click();

    cy.get('.toast-message').should('contain.text', 'El nombre no puede tener menos de 2 caracteres');
  });
});
