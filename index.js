const fs = require('fs');
const inquirer = require('inquirer');
const format = require('./utils/formatSectionsToData.js');

// TODO: Create an array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'project_name',
        message: 'What is the project name?'
    },
    {
        type: 'checkbox',
        name: 'included_sections',
        message: 'What type of sections would you like to include?',
        pageSize: 15,
        choices: 
        [
            new inquirer.Separator('---Most common---'),
            {name: 'Description', checked: true},
            {name: 'Table of Contents', checked: true},
            {name: `Installation`, checked: true},
            {name: 'Usage', checked: true},
            new inquirer.Separator('---Other sections---'),
            {name: 'License'},
            {name: 'Contributing'},
            {name: 'Tests'},
            {name: 'Questions'},
            {name: 'Finished Product'},
            {name: 'Other'}
        ]
    }
];


async function writeToFile(fileName, data) {
    let set = await inquirer.prompt(
        {
            type: 'input',
            name: 'path',
            message: 'Please enter the full path you would like the file saved to (Default will save the file to the output folder located within this app)',
            default: `./output/`
        }
    )
    fs.writeFile(`${set.path}${fileName}`, data, err => err ? console.error(err) : console.log('Success!'))
}



async function includeBreaks(sections) {
    let br_sections = {}
    const breaks = await inquirer.prompt(
        {
            type: 'checkbox',
            name: 'breaks',
            message: 'Please select which sections should include line breaks below them:\n(Selecting none of the options will mean no line breaks will be included)',
            pageSize: 15,
            choices: () => {
                let array = [(new inquirer.Separator('---Top of List---')),...sections,(new inquirer.Separator('---Bottom of List'))]
                array = array.splice(0, array.length - 2)
                return array
            }
        }
    )

    for (let item of sections) {
        if (breaks.breaks.includes(item)) {
            br_sections[item] = true;
        } else {
            br_sections[item] = false;
        }
    }

    return br_sections
}

// TODO: Create a function to initialize app
async function init() {
    let answers = await inquirer.prompt(questions)
    answers.sections = await includeBreaks(answers.included_sections)
    let data = await format.formatSections(answers.project_name, answers.sections)
    writeToFile(`${answers.project_name}-README.md`, data)
}

// Function call to initialize app
init();