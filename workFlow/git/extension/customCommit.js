const chalk = require('chalk')
const inquirer = require('inquirer')
const { git, shell } = require('@alanchenchen/gittask')

module.exports = async (branch) => {
    console.log(chalk.yellow('请按照以下提示输入commit的内容'))
    const questions = [
        {
            name: 'version',
            message: '需求号/bug号',
            validate(value) {
                if(Number.isInteger(value*1)) {
                    return true
                }
                else {
                    return '值必须是整数'
                }
            }
        },
        {
            name: 'description',
            message: '问题原因',
            validate(value) {
                if(value) {
                    return true
                }
                else {
                    return '值不能为空'
                }
            }
        },
        {
            name: 'resolution',
            message: '解决方案',
            validate(value) {
                if(value) {
                    return true
                }
                else {
                    return '值不能为空'
                }
            }
        }
    ]
    const answers = await inquirer.prompt(questions)
    let commit = '\n'
    Object.values(answers).forEach((item, i) => {
        commit += `${questions[i].message}: ${item}` + '\n'
    })
    await shell(git.commitFile, [`${commit}`])
    return branch
}