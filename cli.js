#!/usr/bin/env node

const fs = require("fs");
const { exec } = require("child_process");
let [, , ...args] = process.argv;
if (!args.length) args = "untitled";
const dirname = __dirname;
const finishUp = `
cd ./${args}
ls -al`;

function createDirectory(path, cb) {
  fs.mkdir(path, cb);
}

function createFile(file, data, cb) {
  fs.writeFile(file, data, cb);
}

function createCopy(src, dest, cb) {
  fs.copyFile(src, dest, cb);
}

// function terminalCommand(cmd, cb) {
//   exec(cmd, cb);
// }

function createProject() {
  createDirectory(`./${args}`, err => {
    if (err) console.log("error creating project directory");
    createDirectory(`./${args}/spec`, err => {
      if (err) console.log("error creating spec file");
      createFile(`./${args}/index.js`, "", err => {
        if (err) console.log("error creating index.js file");
        createCopy(
          `${dirname}/templates/index.spec.js`,
          `./${args}/spec/index.spec.js`,
          err => {
            if (err) console.log(err);
            createCopy(
              `${dirname}/templates/.gitignore`,
              `./${args}/.gitignore`,
              err => {
                if (err) console.log(err);
                createCopy(
                  `${dirname}/templates/.eslintrc`,
                  `./${args}/.eslintrc`,
                  err => {
                    if (err) console.log(err);
                    createCopy(
                      `${dirname}/templates/README.md`,
                      `./${args}/README.md`,
                      err => {
                        if (err) console.log(err);
                        createCopy(
                          `${dirname}/templates/package.json`,
                          `./${args}/package.json`,
                          err => {
                            if (err) console.log(err);
                            // git init in new dir
                            exec("git init", err => {
                              if (err) return "git init failed";
                              console.log(
                                "\x1b[33m%s\x1b[0m",
                                `\nCreating new Node.JS project ${args}...`
                              );
                              console.log(
                                "\x1b[33m%s\x1b[0m",
                                `\ngit initialized for ${args}...\n`
                              );
                              // npm i in new dir
                              exec(
                                "npm i",
                                { cwd: `./${args}` },
                                (err, stdout, stderr) => {
                                  if (err) console.log(`exec error: ${error}`);
                                  console.log(
                                    "\x1b[33m%s\x1b[0m",
                                    `NPM stdout for ${args}:`
                                  );
                                  console.log(`${stdout}`);
                                  console.log(
                                    "\x1b[33m%s\x1b[0m",
                                    `NPM stderr for ${args}:`
                                  );
                                  console.log(`${stderr}`);
                                  // list files in new dir
                                  exec(
                                    finishUp,
                                    { cwd: `${args}` },
                                    (err, stdout, stderr) => {
                                      if (err) console.log(stderr);
                                      console.log(
                                        "\x1b[33m%s\x1b[0m",
                                        `Sorted!\nNew files created in ${args}:`
                                      );
                                      console.log(`${stdout}`);
                                    }
                                  );
                                }
                              );
                            });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  });
}

createProject();
