const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')
const { git, shell } = require('@alanchenchen/gittask')

module.exports = async () => {
    const res = await shell(git.showBranch)
    const branchList = res.split('\n').filter(a => a.includes('remotes/origin')).map(b => b.split('/')[2])

    const { nBranch } = await inquirer.prompt([
        {
            type: 'list',
            name: 'nBranch',
            message: chalk.yellow('选择需要拉取到本地更新的远程分支名：'),
            choices: branchList
        }
    ])
    
    if(Boolean(nBranch)) {
        const spinner = ora(`正在拉取远程分支${nBranch}...`)
        try {
            await shell(git.checkoutBranch, [`${nBranch}`])
            spinner.start()
            await shell(['pull'])
            spinner.succeed()
            return nBranch
        } catch (error) {
            spinner.fail(error)
        }
    }
    else {
        process.exit(1)
    }
    
}