#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");
const repoURL = "https://github.com/moayaan1911/full3.git";

async function promptForProjectName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter project name: ", (name) => {
      rl.close();
      resolve(name);
    });
  });
}

async function main() {
  console.log("Welcome to project initializer!");

  // Get project name
  const projectName = await promptForProjectName();

  // Validate name
  if (!isValidName(projectName)) {
    console.log(
      "Invalid project name entered. Only alphanumeric and hyphens allowed."
    );
    return;
  }

  try {
    // Clone repo
    console.log("Cloning repository...");
    execSync(`git clone ${repoURL} ${projectName}`);

    // Change directory
    process.chdir(projectName);

    // Remove default .git folder
    console.log("Removing default .git folder...");
    let retries = 5;
    function removeGit() {
      try {
        fs.rmSync(".git", { recursive: true, force: true });
      } catch (err) {
        if (retries > 0) {
          retries--;
          setTimeout(removeGit, 1000);
        } else {
          throw err;
        }
      }
    }
    removeGit();

    // Install dependencies

    execSync("npm install -g yarn");
    console.log("Yarn Installed, we recommend using yarn only ");

    console.log("Creating The Starter, please wait some time....");
    execSync("yarn install-all");

    // Initialize git
    console.log("Initializing git...");
    execSync("git init");
    execSync("git add .");
    execSync('git commit -m "Initial commit"');

    console.log(`Project ${projectName} initialized successfully!`);
    function createThankYouFile() {
      const content = `Thank you for using full3!

Full3 is a powerful web3 starter project that provides you with all the tools and features you need to kickstart your web3 development journey. It's powered by React, Hardhat, Tailwind, and Thirdweb, making it easy to build full-stack web3 applications. Powered by React.js, Vite, Thirdweb and Hardhat

About the Developer:
Hey there! I'm Mohammad Ayaan Siddiqui, a decentralization maxi. With a strong passion for Web3, my skills span across web3 research and analysis, front-end development, backend development, smart contract development, content writing, and more. I also have a growing interest in project management and machine learning, constantly expanding my knowledge in these areas. As a technical co-founder, I bring valuable leadership and expertise to drive successful project outcomes. I have previous experience as research intern, web3 developer and technical co-founder as well. I have hands-on experience of React.js, Next.js, Solidity, Javascript, Typescript, Hardhat, technical content writing and project management.

For more information and updates, you can visit the GitHub repository: https://github.com/moayaan1911/full3
Follow the Developer at : https://linkedin.com/in/ayaaneth
Happy coding and building with full3!
`;

      fs.writeFile("thank you.txt", content, (err) => {
        if (err) {
          console.error("Error writing thank you file:", err);
          process.exit(1);
        }
      });
    }

    // Call the function to create the thank you file
    createThankYouFile();
  } catch (err) {
    console.log("Error initializing project:", err);
    process.exit(1);
  }
}

function isValidName(name) {
  return /^[\w-]+$/.test(name);
}

main();
