const fs = require('fs');

class Employee {
    constructor(name, scheduleString) {
        this.name = name;
        this.schedule = new Schedule(scheduleString);
    }
}

class Schedule {
    constructor(timesString) {
        this.times = this.parseTimes(timesString);
    }

    parseTimes(timesString) {
        const times = timesString.split(',');

        const parsedTimes = times.map(time => {
            const day = time.slice(0, 2);
            const hours = time.slice(2).split('-');
            return {
                day: day,
                initHour: hours[0],
                endHour: hours[1]
            };
        });

        return parsedTimes;
    }

    countCoincidences(otherSchedule) {
        let count = 0;

        // Count the number of coincidences between two schedules.
        this.times.forEach(time => {
            otherSchedule.times.forEach(otherTime => {
                if (time.day === otherTime.day) {
                    const maxInitHour = [time.initHour, otherTime.initHour].sort()[1];
                    const minEndHour = [time.endHour, otherTime.endHour].sort()[0];

                    if (maxInitHour < minEndHour) {
                        count++;
                    }
                }
            });
        });

        return count;
    }
}

function getFileSchedules(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function parseSchedules(input) {
    const schedules = input.trim().split('\n');
    const parsedSchedules = [];

    schedules.forEach(schedule => {
        const [name, scheduleString] = schedule.split('=');
        parsedSchedules.push(new Employee(name, scheduleString));
    });

    return parsedSchedules;
}

function schedulesCoincidences(schedules) {
    const coincidences = [];

     // Count the number of coincidences between each pair of employees.
    schedules.forEach(schedule => {
        schedules.forEach(otherSchedule => {
            if (schedule.name !== otherSchedule.name) {
                // Check if the employee pair has already been counted.
                const repeatedEmployees = coincidences.findIndex(coincidence => coincidence.employees.includes(schedule.name) && coincidence.employees.includes(otherSchedule.name)) !== -1;

                if (!repeatedEmployees) {
                    const count = schedule.schedule.countCoincidences(otherSchedule.schedule);

                    if (count > 0) {
                        coincidences.push({
                            employees: `${schedule.name}-${otherSchedule.name}`,
                            count: count
                        })
                    }
                }
            }
        });
    });

    return coincidences;
}

const filePath = process.argv[2];
const fileSchedules = getFileSchedules(filePath);
const parsedSchedules = parseSchedules(fileSchedules);
const coincidences = schedulesCoincidences(parsedSchedules);
console.table(coincidences);