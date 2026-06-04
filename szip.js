const AdmZip = require("adm-zip");
async function createZipArchive() {
    const zip = new AdmZip();
    zip.addLocalFolder("./inc", 'inc');
    //assets/css
    zip.addLocalFolder("./assets/images", "assets/images");
    //zip.addLocalFolder("./assets/languages", "assets/languages");
    //zip.addLocalFolder("./assets/css/fonts", "assets/css/fonts");
    //zip.addLocalFolder("./assets/css/lib", "assets/css/lib");
    zip.addLocalFolder("./assets/css/minify", "assets/css/minify");
    //assets/js
    // zip.addLocalFolder("./assets/js/lib", "assets/js/lib");
    zip.addLocalFolder("./assets/js/minify", "assets/js/minify");
    //zip.addLocalFolder("./assets/js/tel", "assets/js/tel");
    zip.addLocalFile("sun-form-builder.php");
    zip.addLocalFile("readme.txt");
    const outputFile = "sun-form-builder.zip";
    zip.writeZip(outputFile);
    const AddonsZip = new AdmZip("./sun-form-builder.zip");
    var zipEntrys = AddonsZip.getEntries();
    zipEntrys.forEach(function(entry){
        let entryName = entry.entryName;
        if(entryName.includes('assets/css/minify') && entryName.includes('.js')){
            console.log(entry.entryName);
            AddonsZip.deleteFile(entry.entryName); // Kiểm tra lại xem khi run build có tạo file asset trong minify css không
        }
    });
    AddonsZip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
}

createZipArchive();