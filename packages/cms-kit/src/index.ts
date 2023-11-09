#! /usr/bin/env node
import figlet from "figlet";
import { Command } from "commander";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";

const program = new Command();

console.log(figlet.textSync("cms-kit"));

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-g, --generate  [value]", "List directory contents")
  .parse(process.argv);

const options = program.opts();

console.log(options);

if (options.generate) {
  scanFiles();
}

async function scanFiles() {
  let basePath = __dirname;
  const files = await getFilesInDirectoryAsync("./", ".ts");
  console.log(files);
  files.map(async (file: any) => {
    const res = await fs.readFile(file, "utf-8");

    if (res.includes("export function hey()") && file !== "src/index.ts") {
      console.log(res);
      console.log("function has been found");
      exec(
        `npx ts-node -e 'require("./${file}").hey()'`,
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        }
      );
    }
  });
}

// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
async function getFilesInDirectoryAsync(
  dir: string,
  ext: string
): Promise<any> {
  let files: any[] = [];
  const filesFromDirectory = await fs.readdir(dir).catch((err) => {
    throw new Error(err.message);
  });

  for (let file of filesFromDirectory) {
    if (!["node_modules", ".gitignore"].includes(file)) {
      const filePath = path.join(dir, file);
      const stat = await fs.lstat(filePath); // If it is a directory, then will call recursive function for that dir.
      // If it is a file and the extenstion is match, then it will add into the array of files.

      if (stat.isDirectory()) {
        const nestedFiles = await getFilesInDirectoryAsync(filePath, ext);
        files = files.concat(nestedFiles);
      } else {
        if (ext.includes(path.extname(file))) {
          files.push(filePath);
        }
      }
    }
  }
  return files;
}
