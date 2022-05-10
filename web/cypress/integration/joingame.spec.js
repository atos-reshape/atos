/// <reference types = "cypress"/>
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
describe('Frontend Testing', () => {
  //   beforeEach(() => {
  //     cy.visit('http://localhost:3000/join');
  //   });

  it('joins a game', () => {
    cy.visit('http://localhost:3000/join');
    cy.contains('Game Code');
    cy.get('input[placeholder*="Game Code"]').type('UZS4RZ');
    cy.contains('Player Name');

    cy.get('input[placeholder*="Player Name"]').type('Testing');
    cy.get('button').contains('Join Game').click();

    cy.url().should('include', 'game');
  });

  it('tests if game view is rendered properly', () => {
    cy.contains('Personal Color Phase');
    cy.contains('Lobby name');
    cy.contains('Code:');
  });

  it('likes first 3 cards'),
    () => {
      cy.get('#like').click();
      cy.get('#like').click();
      cy.get('#like').click();
    };
});
