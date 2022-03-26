const fs = require('fs')
const inquirer = require('inquirer')


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
    for (let index = 1; index < Object.keys(sections).length+1; index++) {
        text += `${index}.  [${Object.keys(sections)[index]}](#${Object.keys(sections)[index].toLowerCase()})\n`
    }
}


const inst_prompt = 
`## Installation
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
`## How it works
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


async function formatLicense(doesBreak) {
    const licenses_promise = await fetch('https://api.github.com/licenses')
    const licenses = await licenses_promise.json()
    const license_names = () => {
        let array = [];
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
        },
        {
            type: 'input',
            name: 'git_user',
            message: 'What is the github username you will put the license under?'
        }
    )
    
    let today = new Date()
    let text = `## License\n\n Copyright (c) ${today.getFullYear()} ${response.git_user} Licensed under the ${response.license} license.\n\n`

    if (doesBreak) {
        text += `---\n\n`
    }

    return text
}

const cont_prompt = 
`## Contributing
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
        text += `---\n`
    }

    return text
}

const tests_prompt = 
`## Contributing
<!-- Here you should enter how you have tested the project, and possibly any images or videos demonstrating it's use -->
<!-- You can format your images or videos like this: ![Image or video name](image/video link or relative path) -->\n\n`
async function formatContSection(doesBreak) {
    let response = await inquirer.prompt({
        type: 'editor',
        name: 'user_text',
        message: 'To create your contributing section',
        default: tests_prompt
    })

    let text = `${response.user_text}\n\n`
    if (doesBreak) {
        text += `---\n`
    }

    return text
}


async function formatFinishedProduct(project_name, doesBreak) {
    let text = `## Finished Product\n\n`
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
        text += `---\n`
    }

    return text
}

const other_prompt = 
`## Misc/Other
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
        text += `---\n`
    }

    return text
}
 

async function formatSections(project_name, sections) {
    let data = `# ${project_name}\n\n`
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
                data += await formatUsageSection(project_name, sections[section])
                break;
            case 'License':
                data += await formatLicense(doesBreak)
                break;
            case 'Contributing':
                data += await formatContSection(doesBreak)
                break;
            case 'Tests':
                data += await formatTests(doesBreak)
                break;
            case 'Questions':
                data += await formatQuestions(doesBreak)
                break;
            case 'Finisehd Product':
                data += await formatFinishedProduct(doesBreak)
                break;
            case 'Other':
                data += await formatOther(doesBreak)
                break;
        }
    }
    return data
}

module.exports = {formatSections};