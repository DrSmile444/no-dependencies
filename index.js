#!/usr/bin/env node
const fs = require('fs');
const execSync = require('child_process').execSync;
const commander = require('commander').program;
const updateNotifier = require('update-notifier');

const packageJsonFile = './package.json';
const backupPackageJsonFile = './package.bak.json';
const resultPackageJsonFile = './package.result.json';
const defaultCommand = process.env.NODE_ENV === 'development' ? 'echo 0' : 'npm publish';

const packageJson = require(packageJsonFile);

updateNotifier({ pkg: packageJson }).notify();

commander.version(packageJson.version);
commander
  .description(packageJson.description)
  .option('-b, --before', 'creates a package.json backup and deletes dependencies')
  .option('-e, --exec <command>', 'executes a specified command with a clean package.json. Default is: ' + defaultCommand)
  .option('-i, --includes <dependencies>', 'dependencies that should be included as dependencies separated by comma: --includes commander,update-notifier')
  .option('-a, --after', 'returns back a backuped package.json')
  .option('-d, --debug', 'leaves backup and result files')
  .option('-c, --clear', 'cleares all temp files. Uses with or after the "--debug" command');

commander.parse(process.argv);


class NoDependencies {
  beforeUserCommand() {
    let projectPackageJson;
    try {
      projectPackageJson = JSON.parse(fs.readFileSync(packageJsonFile, { encoding: 'utf-8' }));
    } catch(e) {
      this.logWarning('Cannot parse the file. Invalid ' + packageJsonFile);
      process.exit(1);
    }
    this.logStep('Read the ' + packageJsonFile);

    fs.copyFileSync(packageJsonFile, backupPackageJsonFile);
    this.logStep('Created a ' + backupPackageJsonFile);

    const includesDependencies = commander.includes && commander.includes.replace(/ /g, '').split(',');
    if (!includesDependencies) {
      delete projectPackageJson.dependencies;
      delete projectPackageJson.devDependencies;
      this.logStep('Deleted dependencies from the ' + packageJsonFile);
    } else {
      Object.keys(projectPackageJson.dependencies)
        .filter((dependency) => !includesDependencies.includes(dependency))
        .forEach((dependency) => delete projectPackageJson.dependencies[dependency]);

      Object.keys(projectPackageJson.devDependencies)
        .filter((dependency) => !includesDependencies.includes(dependency))
        .forEach((dependency) => delete projectPackageJson.devDependencies[dependency]);

      if (Object.keys(projectPackageJson.dependencies).length === 0) {
        delete projectPackageJson.dependencies;
      }

      if (Object.keys(projectPackageJson.devDependencies).length === 0) {
        delete projectPackageJson.devDependencies;
      }

      this.logStep('Deleted dependencies from the ' + packageJsonFile);
      this.logStep('Included dependencies:' + includesDependencies);
    }


    fs.writeFileSync(packageJsonFile, JSON.stringify(projectPackageJson, null, '  '));
    this.logStep(`Write a new ${packageJsonFile} without dependencies`);
  }

  callExecCommand() {
    const command = commander.exec || defaultCommand;
    console.log('');
    execSync(command, { stdio: 'inherit' });
    console.log('\n');
    noDependencies.logStep('Executed the command: ' + command);
  }

  afterUserCommand() {
    if (commander.debug) {
      fs.copyFileSync(packageJsonFile, resultPackageJsonFile);
      this.logWarning('Copy the ' + resultPackageJsonFile);
    }

    fs.unlinkSync(packageJsonFile);
    this.logStep('Deleted the ' + packageJsonFile);

    fs.copyFileSync(backupPackageJsonFile, packageJsonFile);
    this.logStep(`Copy ${backupPackageJsonFile} to ${packageJsonFile}`);

    if (!commander.debug) {
      fs.unlinkSync(backupPackageJsonFile);
      this.logStep('Deleted the ' + backupPackageJsonFile);
    } else {
      this.logWarning('Don\'t delete the ' + backupPackageJsonFile);
    }
  }

  clearAllFiles() {
    if (fs.existsSync(backupPackageJsonFile)) {
      fs.unlinkSync(backupPackageJsonFile);
    }
  
    if (fs.existsSync(resultPackageJsonFile)) {
      fs.unlinkSync(resultPackageJsonFile);
    }
  
    noDependencies.logStep('Deleted all temp files!');
  }

  logScenario(message) {
    console.log('⭕ ' + message);
  }

  logStep(message) {
    console.log('✔️  ' + message);
  }

  logWarning(message) {
    console.log('⚠️  ' + message);
  }
}

const noDependencies = new NoDependencies();

if (commander.before) {
  noDependencies.logScenario('Before scenario');
  noDependencies.beforeUserCommand();
  noDependencies.logStep('Done!');
  console.log('');
} else if (commander.after) {
  noDependencies.logScenario('After scenario');
  noDependencies.afterUserCommand();
  noDependencies.logStep('Done!');
} else {
  noDependencies.logScenario('Standard scenario');
  noDependencies.beforeUserCommand();
  noDependencies.callExecCommand();
  noDependencies.afterUserCommand();

  if (!commander.debug) {
    noDependencies.clearAllFiles();
  }

  noDependencies.logStep('Done!');
}

if (commander.clear) {
  noDependencies.clearAllFiles();
}
