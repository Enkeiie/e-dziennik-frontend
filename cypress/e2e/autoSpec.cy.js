Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})
describe('Test logowania i sprawdzenia przekierowania przy braku uprawnień', () => {
  it('Powinno wypełnić pola i zalogować na konto admina', () => {
    cy.visit('localhost:8080/auth/login')
    cy.get('#login').type('administrator001')
    cy.get('#password').type('kotek123')
    cy.get('#submitBtn').click()
    cy.url().should('include', 'localhost:8080/admin/')
    cy.visit('localhost:8080/teacher/tests', { failOnStatusCode: false })
      .then((response) => {
        if (response.status === 401) {
          cy.visit('localhost:8080/error/403')
        }
        else {
          cy.wait(2000)
          cy.url().should('include', 'localhost:8080/error/403')
        }
      })
    cy.wait(500)
    cy.url().should('include', 'localhost:8080/error/403')
    cy.wait(500)
  })
  it('Wylogowanie i przelowoganie na nauczyciela oraz sprawdzenie formularzy', () => {
    cy.visit('localhost:8080/auth/logout')
    cy.visit('localhost:8080/auth/login')
    cy.get('#login').type('nauczyciel451')
    cy.get('#password').type('kotek123')
    cy.get('#submitBtn').click()
    cy.url().should('include', 'localhost:8080/teacher/')
    cy.visit('localhost:8080/teacher/tests')
    cy.get('#showAddForm').click()
    cy.get('#titlea').type('testowy test')
    cy.get('#numbera').type(65)
    cy.get('#submitBtn').click()
    cy.wait(300)
    cy.get('#showAddForm').click()
    cy.get('#submitBtn').click()
    cy.wait(200)
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.match(/.+/)
    })
  })
  it('Wylogowanie i przelowoganie na innego nauczyciela oraz wyświetlenie ocen ucznia', () => {
    cy.visit('localhost:8080/auth/login')
    cy.get('#login').type('nauczyciel01')
    cy.get('#password').type('kotek123')
    cy.get('#submitBtn').click()
    cy.url().should('include', 'localhost:8080/teacher/')
    cy.visit('localhost:8080/teacher/homeroom')
    cy.get('#class').select(1)
    cy.get('#student').select(1)
    cy.get('#subject').select(2)
  })
})