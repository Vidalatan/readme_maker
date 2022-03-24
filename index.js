const genMark = require('./utils/generateMarkdown');
const fs = require('fs');
const inquirer = require('inquirer');
const { format } = require('path');

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
        pageSize: 5,
        loop: false,
        choices: 
        [
            new inquirer.Separator('Most common'),
            {name: 'What is it?', value: 'what_section', checked: true},
            {name: 'Purpose', value: 'purpose', checked: true},
            {name: 'How it works', value: 'how_section', checked: true},
            {name: 'Finished Product', value: 'finished_section', checked: true},
            new inquirer.Separator('Other sections'),
            {name: 'License', value: 'license'},
            {name: 'Contributers', value: 'cont'},
            {name: 'Footnotes', value: 'footnotes'},
            {name: 'Other', value: 'other'}
        ]
    }
];



// TODO: Create a function to write README file
function writeToFile(fileName, data) {}



async function includeBreaks(sections) {
    let br_sections = {}
    const breaks = await inquirer.prompt(
        {
            type: 'checkbox',
            name: 'breaks',
            message: 'Please select which sections should include line breaks below them:\n(Selecting none of the options will mean no line breaks will be included)',
            choices: () => {
                let array = [...sections]
                array.pop()
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
    console.log(answers);
}

// Function call to initialize app
init();




// for (let section of answers) {
//     switch (section) {
//         case 'what_section':
//             writeWhatSection()
//             break;
//         case 'purpose':
//             writePurpose()
//             break;
//         case 'how_section':
//             writeHowTo()
//             break;
//         case 'finished_section':
//             writeFinishedProduct()
//             break;
//         case :
            
//             break;
//         case :
            
//             break;
//         case :
            
//             break;
//         case :
            
//             break;
//     }
// }