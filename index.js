// Use `fs` for reading data files and writing the result to `result.out`
const fs = require('fs');

/**
 * Reads in a file and returns it as json data.
 * @param path The given path of the file to read.
 * @returns JSON data
 */
function retrieveData(path) {
    let rawData = fs.readFileSync(path);
    return JSON.parse(rawData);
}

/**
 * Outputs provided data as a JSON file named 'result.json'.
 * @param result The given data to write to file.
 */
function writeToFile(result) {
    fs.writeFile('result.json', JSON.stringify(result), err => {
        if (err) throw err;
    });
}

/**
 * Constructs and returns a new object representing the student, with a property for fullName.
 * @param student The data object of the student
 * @returns {{fullName: *, id: *}}
 */
function constructStudentObj(student) {
    return {
        id: student.id,
        fullName: [student.firstName, student.lastName].join(' ')
    }
}

/**
 * Returns a collection of the provided array of students in groups categorised by team id.
 * @param studentTeams The provided array of objects linking students to teams.
 * @param students The full list of students.
 */
function groupStudentsByTeam(studentTeams, students) {
    let teams = {};

    studentTeams.forEach(function(item) {
        if (!teams[item.teamId]) {
            teams[item.teamId] = [];
        }

        let matchingStudent = students.find(function(student) {
            return student.id === item.studentId;
        });

        // If we can find the student, do not record them if they are injured
        if (matchingStudent && !matchingStudent.injured) {
            let studentObj = constructStudentObj(matchingStudent);
            teams[item.teamId].push(studentObj);
        }
    });

    return teams;
}

/**
 * Returns the resulting team data object.
 * @param studentsByTeam The provided object that groups students by team id.
 * @param teams The full list of teams.
 */
function constructResultObject(studentsByTeam, teams) {
    teams.forEach(function(team) {
        team.students = studentsByTeam[team.id];
        team.students.sort(function(studentA, studentB) {
            studentA = studentA.fullName.toLowerCase();
            studentB = studentB.fullName.toLowerCase();

            return (studentA < studentB) ? -1 : (studentA > studentB) ? 1 : 0;
        });
    });
    return {team: teams};
}

/**
 * The main program function.
 */
function executeProgram() {
    let students = retrieveData('data/students.json');
    let teams = retrieveData('data/teams.json');
    let studentTeams = retrieveData('data/student-teams.json');

    let studentsByTeam = groupStudentsByTeam(studentTeams, students);

    let result = constructResultObject(studentsByTeam, teams);
    writeToFile(result);
}


// Run the program
executeProgram();
