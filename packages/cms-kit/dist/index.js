#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = __importDefault(require("figlet"));
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const program = new commander_1.Command();
console.log(figlet_1.default.textSync("cms-kit"));
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
function scanFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        let basePath = __dirname;
        const files = yield getFilesInDirectoryAsync("./", ".ts");
        console.log(files);
        files.map((file) => __awaiter(this, void 0, void 0, function* () {
            const res = yield promises_1.default.readFile(file, "utf-8");
            if (res.includes("export function hey()") && file !== "src/index.ts") {
                console.log(res);
                console.log("function has been found");
                (0, child_process_1.exec)(`npx ts-node -e 'require("./${file}").hey()'`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
            }
        }));
    });
}
// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
function getFilesInDirectoryAsync(dir, ext) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = [];
        const filesFromDirectory = yield promises_1.default.readdir(dir).catch((err) => {
            throw new Error(err.message);
        });
        for (let file of filesFromDirectory) {
            if (!["node_modules", ".gitignore"].includes(file)) {
                const filePath = path_1.default.join(dir, file);
                const stat = yield promises_1.default.lstat(filePath); // If it is a directory, then will call recursive function for that dir.
                // If it is a file and the extenstion is match, then it will add into the array of files.
                if (stat.isDirectory()) {
                    const nestedFiles = yield getFilesInDirectoryAsync(filePath, ext);
                    files = files.concat(nestedFiles);
                }
                else {
                    if (ext.includes(path_1.default.extname(file))) {
                        files.push(filePath);
                    }
                }
            }
        }
        return files;
    });
}
//# sourceMappingURL=index.js.map