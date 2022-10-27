describe("Home Page", () => {
  beforeEach(() => {
    // Setup/Start Cypress Mock server and API route
    cy.fixture("courses.json").as("coursesJSON");
    cy.server();
    cy.route("/api/courses", "@coursesJSON").as("courses");

    // Visit Page and wait for mock server to complete request
    cy.visit("/");
    cy.wait("@courses");
  });

  it("should display a list of courses", () => {
    cy.contains("All Courses");

    // Get all course cards
    cy.get("mat-card").should("have.length", 9);
  });

  it("should display advanced list of courses", () => {
    // Get all course cards
    cy.get(".mat-tab-label").should("have.length", 2);
    cy.get(".mat-tab-label").last().click();
    cy.get(".mat-tab-body-active .mat-card-title")
      .its("length")
      .should("be.gt", 1);
    cy.get(".mat-tab-body-active .mat-card-title")
      .first()
      .should("contain", "Angular Security Course");
  });
});
