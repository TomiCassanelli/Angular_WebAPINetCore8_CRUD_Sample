describe('addEmployee - contiene números', () => {
  it('El test no permitirá que el nombre posea numeros', () => {
    cy.visit('http://localhost:4200/addemployee/');
    
    cy.get('.form-control').type('Tomasssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
    
    cy.get('.btn').click();
    cy.get('.btn').click();

    cy.get('.toast-message').should('contain.text', 'El nombre no puede tener mas de 100 caracteres');
  });
});
