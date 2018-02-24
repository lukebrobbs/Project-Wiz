#!/usr/bin/env node

const fs = require("fs");
const child_ps = require("child_process");
let [, , ...args] = process.argv;
if (!args.length) args = "untitled";
const dirname = __dirname;

function createDirectory(path, cb) {
  fs.mkdir(path, cb);
}

function createFile(file, data, cb) {
  fs.writeFile(file, data, cb);
}

function createCopy(src, dest, cb) {
  fs.copyFile(src, dest, cb);
}

function terminalCommand(cmd, cb) {
  child_ps.exec(cmd, cb);
}

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
                            terminalCommand("git init", err => {
                              if (err) return "git init failed";
                              terminalCommand(
                                "npm i",
                                {
                                  cwd: `./${args}`
                                },
                                (err, stdout, stderr) => {
                                  if (err) console.log("npm i failed");
                                  console.log(stdout);
                                  console.log(stderr);
                                  console.log("Sorted!");
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
