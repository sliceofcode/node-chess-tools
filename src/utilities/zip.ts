import * as fs from 'fs';
import * as JSZip from 'jszip';


export class Zip {
    public static zipDirectoryFiles(directory: string, zipFilePath: string, filePrefix: string = ''): void {
        const directoryFiles = fs.readdirSync(directory);
        const zip = new JSZip();
        directoryFiles.map((filename) => {
            const fileContents = fs.createReadStream(`${directory}/${filename}`);
            zip.file(`${filePrefix}${filename}`, fileContents);
        });

        zip
            .generateNodeStream({type: 'nodebuffer', streamFiles: true})
            .pipe(fs.createWriteStream(zipFilePath));
    }
}
