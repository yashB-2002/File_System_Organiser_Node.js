const { dir } = require("console");
let fs = require("fs")
let path = require("path")
let input = process.argv.slice(2);
//console.log(input);
let cmd = input[0];
let categorizes  = {
    media: ["mp4", "mkv","mp3"],
    image : ['jpg','jpeg','mpg'],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    app: ['exe', 'dmg', 'pkg', "deb"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'] 
}
switch (cmd) {
    case "tree" :
        tree(input[1]);
        break;
    case "organize":
        organize(input[1]);
        break;
    case "help":
        help();
        break;
    default:
        console.log("enter right cmd ");
}


// --------------------------------------------------------------
// organize functionality


function organize(dirpath) {
    if(dirpath == undefined) {
        console.log("error path unavailable");
        return;
    }
    else {
        if(!fs.existsSync(dirpath)) {
            console.log("path does not exist");
            return;
        } 
        else {
            if(!fs.existsSync(path.join(dirpath,"organized"))) {
                fs.mkdirSync(path.join(dirpath,"organized"));
            }
        }
    }
    organizingFn(dirpath,path.join(dirpath,"organized"));
}

function organizingFn(path1,path2) {
    let names = fs.readdirSync(path1)
    // console.log(names);
    for(let i= 0; i< names.length;i++) {
        let namesPath = path.join(path1,names[i]);
        let isFile = fs.lstatSync(namesPath).isFile();
        if(isFile) {
            // console.log(`${i+1} file name is :- ${names[i]}`);
            // console.log("category of file ",names[i], "is",getFileExt(names[i]));
            copyfileFn(namesPath,path2,getFileExt(names[i]));
        }    
    }

}
function copyfileFn(srcFilePath, desFilePath, copyFileCategory) {
    let copyFileCategoryPath = path.join(desFilePath,copyFileCategory);
    if(!fs.existsSync(copyFileCategoryPath)) {
        fs.mkdirSync(copyFileCategoryPath);
    }
    let fileNameToBeCopy = path.basename(srcFilePath);
    let fileNameDestPath = path.join(copyFileCategoryPath,fileNameToBeCopy);
    fs.copyFileSync(srcFilePath,fileNameDestPath); // copying file to destination folder
    fs.unlinkSync(srcFilePath); // removing file from source folder
}

function getFileExt(fileName) {
    let ext = path.extname(fileName);
    ext = ext.slice(1);
    for(let category in categorizes) {
        let arr = categorizes[category];
        for(let i = 0; i < arr.length; i++ ){
            if(arr[i] == ext) {
                return category;
            }
        }
    }
    return "invalid category";
}
// --------------------------------------------------------------
// tree functionality

function tree(dirpath) {
    if(dirpath == undefined) {
        console.log("path unavailable");
        return;
    }
    else {
        if(fs.existsSync(dirpath)) {
            treefn(dirpath);
        }
        else {
            console.log("Enter valid path");
            return;
        }
    }
}
function treefn(dirpath) {
    let isDir = fs.lstatSync(dirpath).isDirectory();
    if(isDir) {
        let dirName = path.basename(dirpath);
        console.log("folder Name " + dirName );
        let filesArr = fs.readdirSync(dirpath);
        for(let i=0; i < filesArr.length; i++) {
            let childPath = path.join(dirpath,filesArr[i]);
            treefn(childPath);
        }
    }
    else {
        console.log("  |-------- "  + path.basename(dirpath) + "\t");
    }
}

// --------------------------------------------------------------
// help functionality

function help() {
    console.log(`
        node main.js organize "dirPath"
        node main.js tree "dirPath"
        node main.js help
    `);
}
