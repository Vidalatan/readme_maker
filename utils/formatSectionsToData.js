const fs = require('fs')
const inquirer = require('inquirer')
const fetch = require('node-fetch')

const license_badges = {
    0: '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)',
    1: '[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)',
    2: '[![License](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)',
    3: '[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)',
    4: '[![License](https://img.shields.io/badge/License-Boost_1.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)',
    5: '[![License: CC0-1.0](https://licensebuttons.net/l/zero/1.0/80x15.png)](http://creativecommons.org/publicdomain/zero/1.0/)',
    6: '[![License](https://img.shields.io/badge/License-EPL_1.0-red.svg)](https://opensource.org/licenses/EPL-1.0)',
    7: '[![License: GPL v2](https://img.shields.io/badge/License-GPL_v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)',
    8: '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)',
    9: '[![License: LGPL v3](https://img.shields.io/badge/License-LGPL_v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)',
    10: '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
    11: '[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)',
    12: '[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)'
}

let license_badge;


const desc_prompt = 
`## Description
<!-- Here you should enter a little about your project. -->\n\n`
async function formatDescSection(doesBreak) {
    let response = await inquirer.prompt({
        type: 'editor',
        name: 'user_text',
        message: 'To create your description',
        default: desc_prompt
    })

    let text = `${response.user_text}\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}

function formatTOC(sections) {
    let text = '## Table of Contents\n\n'
    for (let index = 1; index < Object.keys(sections).length; index++) {
        if (Object.keys(sections)[index] !== "Description" && Object.keys(sections)[index] !== "Table of Contents") {
            text += `${index-1}.  [${Object.keys(sections)[index]}](#${Object.keys(sections)[index].toString().toLowerCase().replace(" ","-")})\n\n`
        }
    }

    if (sections["Table of Contents"]) {
        text += `---\n\n`
    }

    return text
}


const inst_prompt = 
`## [Installation](#installation)
<!-- Here you should enter how to install your project. You can use the outline below, or create one yourself -->
<!-- If you would like to have images in your instructions, enclose them like so: ![Image name](image link or relative path) -->

<!-- Make sure to have a '>' character before each new line -->
>## Step One
>
>
>

>## Step Two
>
>
>

>## Step Three
>
>
>`
async function formatInstSection(doesBreak) {
    let response = await inquirer.prompt({
        type: 'editor',
        name: 'user_text',
        message: 'To create your installation instructions',
        default: inst_prompt
    })

    let text = `${response.user_text}\n\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}
 
const usage_prompt = 
`## [Usage](#usage)
<!-- Here you should enter how to use your project. You can use the outline below, or create one yourself -->
<!-- If you would like to have images in your how to, enclose them like so ![Image name](image link or relative path) -->

<!-- Make sure to have a '>' character before each new line -->
>## Step One
>
>
>

>## Step Two
>
>
>

>## Step Three
>
>
>`
async function formatUsageSection(doesBreak) {
    let response = await inquirer.prompt({
        type: 'editor',
        name: 'user_text',
        message: 'To create your usage section',
        default: usage_prompt
    })

    let text = `${response.user_text}\n\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}


async function formatLicense(doesBreak, user_gitName) {
    const licenses_promise = await fetch('https://api.github.com/licenses')
    const licenses = await licenses_promise.json()
    let array = [];
    const license_names = () => {
        for (item in licenses) {
            array.push(licenses[item].name)
        }
        return array
    }
    let response = await inquirer.prompt(
        {
            type: 'list',
            name: 'license',
            message: 'Please select one of the licenses below:',
            choices: license_names()
        }
    )

    for (index in array) {
        if (array[index] === response.license) {
            license_badge = license_badges[index]
        }
    }
    
    let today = new Date()
    let text = `## [License](#license)\n${license_badge}\n\n Copyright (c) ${today.getFullYear()} ${user_gitName} Licensed under the ${response.license} license.\n\n`

    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}

const cont_prompt = 
`## [Contributing](#contributing)
<!-- Here you should enter how someone should contribute to your project, or what guidelines to follow -->\n\n`
async function formatContSection(doesBreak) {
    let response = await inquirer.prompt({
        type: 'editor',
        name: 'user_text',
        message: 'To create your contributing section',
        default: cont_prompt
    })

    let text = `${response.user_text}\n\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}

const tests_prompt = 
`## [Tests](#tests)
<!-- Here you should enter how you have tested the project, and possibly any images or videos demonstrating it's use -->
<!-- You can format your images or videos like this: ![Image or video name](image/video link or relative path) -->\n\n`
async function formatTests(doesBreak) {
    let response = await inquirer.prompt({
        type: 'editor',
        name: 'user_text',
        message: 'To create your tests section',
        default: tests_prompt
    })

    let text = `${response.user_text}\n\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}

async function formatQuestions(doesBreak, user_gitName) {
    let response = await inquirer.prompt(
        {
            type: 'input',
            name: 'user_email',
            message: 'What email would you prefer people to contact you regarding questions?'
        }
    )

    let text = `## [Questions](#questions)\n\n Questions regarding this project should be directed towards @${user_gitName} at ${response.user_email}\n\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}


async function formatFinishedProduct(project_name, doesBreak) {
    let text = `## [Finished Product](#finished_product)\n\n`
    let response = await inquirer.prompt([
        {
        type: 'input',
        name: 'relative_path',
        message: 'Please edit the relative path of your image you would like to use for the finished product (You can leave it empty for now. You will have to add it later)',
        default: './assets/images/FinishedProductImage.png'
        },
        {
            type: 'input',
            name: 'git_page_url',
            message: 'Please enter the git hub pages url (If you do not have one yet, you can leave this blank. You will have to add it later\nTypical format is "https://{git-username}.github.io/{project-name}"',
            default: 'https://{git-username}.github.io/{project-name}'
        },
        {
            type: 'input',
            name: 'git_repo_url',
            message: 'Please enter the git hub repo url (If you have not pushed to git hub yet, you can leave this blank. You will have to add it later)',
            default: 'https://github.com/{git-username}/{project-name}'
        }
    ])
    text += `![Finished Project Image](${response.relative_path})\n\nLink to live [${project_name}](${response.git_page_url})\n\nLink to [Code Repository](${response.git_repo_url})\n\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}

const other_prompt = 
`## [Misc/Other](other)
<!-- This is a miscellaneous/other section that is completely up to you. Have fun with it!-->\n\n`
async function formatOther(doesBreak) {
    let response = await inquirer.prompt({
        type: 'editor',
        name: 'user_text',
        message: 'To create your other section',
        default: other_prompt
    })

    let text = `${response.user_text}\n\n`
    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}
 

async function formatSections(project_name, sections, user_gitName) {
    let data = ''
    console.log(sections);
    for (section in sections) {
        switch (section) {
            case 'Description':
                data += await formatDescSection(sections[section])
                break;
            case 'Table of Contents':
                data += await formatTOC(sections)
                break;
            case 'Installation':
                data += await formatInstSection(sections[section])
                break;
            case 'Usage':
                data += await formatUsageSection(sections[section])
                break;
            case 'License':
                data += await formatLicense(sections[section], user_gitName)
                break;
            case 'Contributing':
                data += await formatContSection(sections[section])
                break;
            case 'Tests':
                data += await formatTests(sections[section])
                break;
            case 'Questions':
                data += await formatQuestions(sections[section], user_gitName)
                break;
            case 'Finished Product':
                data += await formatFinishedProduct(project_name, sections[section])
                break;
            case 'Other':
                data += await formatOther(sections[section])
                break;
        }
    }

    console.log(("License" in sections));
    if ("License" in sections) {
        data = `# ${project_name}\n\n${license_badge}\n\n${data}`
    } else {
        data = `# ${project_name}\n\n${data}`
    }

    return data
}

module.exports = {formatSections};