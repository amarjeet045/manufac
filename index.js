console.log("index");

class EmployeeOrgApp {
  constructor(ceo) {
    this.ceo = ceo;
    this.history = [];
    this.redoStack = [];
  }

  move(employeeID, supervisorID) {
    const employee = this.findEmployee(this.ceo, employeeID);
    const supervisor = this.findEmployee(this.ceo, supervisorID);

    if (!employee || !supervisor) {
      console.log("Invalid employee ID or supervisor ID.");
      return;
    }

    // Check if the move is valid to avoid cyclic dependencies
    if (this.isCyclicMove(employeeID, supervisorID)) {
      console.log("Invalid move. Cyclic dependency detected.");
      return;
    }

    const oldSupervisor = this.findEmployeeBySubordinate(this.ceo, employeeID);
    if (oldSupervisor) {
      oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
        (sub) => sub.uniqueId !== employeeID
      );
    }

    supervisor.subordinates.push(employee);
    this.history.push({ employeeID, supervisorID });
    this.redoStack = [];
  }

  undo() {
    if (this.history.length === 0) {
      console.log("Nothing to undo.");
      return;
    }

    const { employeeID, supervisorID } = this.history.pop();

    const employee = this.findEmployee(this.ceo, employeeID);
    const oldSupervisor = this.findEmployee(this.ceo, supervisorID);

    oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
      (sub) => sub.uniqueId !== employeeID
    );

    const redoInfo = { employeeID, supervisorID: this.ceo.uniqueId };
    this.redoStack.push(redoInfo);
  }

  redo() {
    if (this.redoStack.length === 0) {
      console.log("Nothing to redo.");
      return;
    }

    const { employeeID, supervisorID } = this.redoStack.pop();

    const employee = this.findEmployee(this.ceo, employeeID);
    const supervisor = this.findEmployee(this.ceo, supervisorID);

    supervisor.subordinates.push(employee);
    this.history.push({ employeeID, supervisorID });
  }

  findEmployee(root, employeeID) {
    if (!root) return null;

    if (root.uniqueId === employeeID) {
      // console.log(root,"Shksh")
      return root;
    }

    for (const subordinate of root.subordinates) {
      // console.log(subordinate,root.subordinates)
      // console.log(employeeID)
      const result = this.findEmployee(subordinate, employeeID);

      if (result) {
        return result;
      }
    }
  }

  findEmployeeBySubordinate(root, employeeID) {
    for (const subordinate of root.subordinates) {
      if (subordinate.uniqueId === employeeID) {
        return root;
      }

      const result = this.findEmployeeBySubordinate(subordinate, employeeID);
      if (result) {
        return result;
      }
    }

    return null;
  }

  isCyclicMove(employeeID, supervisorID) {
    const supervisor = this.findEmployee(this.ceo, supervisorID);

    if (supervisor === null) {
      return false;
    }

    if (supervisor.uniqueId === employeeID) {
      return true;
    }

    for (const subordinate of supervisor.subordinates) {
      if (this.isCyclicMove(employeeID, subordinate.uniqueId)) {
        return true;
      }
    }

    return false;
  }
}

// Example usage:

// Create employees and their initial hierarchy
const ceo = { uniqueId: 1, name: "John Doe", subordinates: [] };
// subordinates of ceo
const employee1 = { uniqueId: 2, name: "Margot Donald", subordinates: [] };
const employee2 = { uniqueId: 3, name: "Tyler Simpson", subordinates: [] };
const employee3 = { uniqueId: 4, name: "Ben Willis", subordinates: [] };
const employee4 = { uniqueId: 5, name: "Georgina Flangy", subordinates: [] };
// employee details of margot

const employee5 = { uniqueId: 6, name: "Cassandra Reynolds", subordinates: [] };
const employee6 = { uniqueId: 7, name: "Mary Blue", subordinates: [] };
const employee7 = { uniqueId: 8, name: "Bob Saget", subordinates: [] };
const employee8 = { uniqueId: 9, name: "Tina Teff", subordinates: [] };
const employee9 = { uniqueId: 10, name: "Will Turner", subordinates: [] };
// Tyler
const employee10 = { uniqueId: 11, name: "Harry Tobs", subordinates: [] };
const employee11 = { uniqueId: 12, name: "Thomas Brown", subordinates: [] };
const employee12 = { uniqueId: 13, name: " George Carrey", subordinates: [] };
const employee13 = { uniqueId: 14, name: "Gary Styles", subordinates: [] };
// Sophie Turner
const employee14 = { uniqueId: 15, name: "Sophie Turner", subordinates: [] };
ceo.subordinates.push(employee1, employee2, employee3, employee4);
employee2.subordinates.push(employee6, employee7);
employee5.subordinates.push(employee6, employee7);
employee7.subordinates.push(employee8);
employee8.subordinates.push(employee9);
employee3.subordinates.push(employee10, employee12, employee13);
employee10.subordinates.push(employee11);
employee4.subordinates.push(employee14);

// Instantiate the EmployeeOrgApp
const app = new EmployeeOrgApp(ceo);

// Move employee3 to be subordinate of employee1
app.move(8, 5);

// // Undo the last move (move employee1 back to subordinate of employee2)
app.undo();
// console.log(app);

// // Redo the last undone action (move employee1 back to subordinate of the CEO)
app.redo();
