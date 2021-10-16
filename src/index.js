const $ = require('jquery');
const ExcelJs = require('exceljs');
const fs = require('fs.promises');
var nodeoutlook = require('nodejs-nodemailer-outlook');
const spawn = require( 'child_process' ).spawnSync;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

$('#processBulkMails').on('click', async () => {
    const workFolder = $('#workfolder').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const masterFile = workFolder + '/Distributors.xlsx';
    const logFile = workFolder + '/logs.txt';
    try {
        $('#status').text('Processing file: ' + masterFile);

        await fs.appendFile(logFile, 'Start: ' + new Date().toISOString() + '\n');
        await fs.appendFile(logFile, 'Processing file: ' + masterFile + '\n');

        let workbook = new ExcelJs.Workbook();

        workbook = await workbook.xlsx.readFile(masterFile);
        const worksheet = workbook.getWorksheet(1);
        await fs.appendFile(logFile, 'Distributors Count: ' + worksheet.actualRowCount - 1 + '\n');

        $('#status').text('Processing distributors');
        const mailingist = [];
        for (const row of worksheet.getRows(2, worksheet.actualRowCount - 1)) {
            const distributorCode = row.getCell(1).text;
            const distributorName = row.getCell(2).text;
            const to = row.getCell(3).text;
            const cc = row.getCell(4).text;
            const subject = row.getCell(5).text;

            const mailObj = {};
            mailObj.distributorCode = distributorCode;
            mailObj.distributorName = distributorName;
            mailObj.to = to;
            mailObj.cc = cc;
            mailObj.subject = subject;

            $('#status').text('Processing distributor: ' + distributorName);
            await fs.appendFile(logFile, 'Processing distributor: ' + distributorName + '\n');
            const files = await fs.readdir(workFolder);
            const distributorFiles = files.filter(f => f.startsWith(distributorCode + ' ')).forEach(f => f = workFolder + '\\' + f);
            await fs.appendFile(logFile, 'Appending files: ' + distributorFiles + ' for distributor: ' + distributorName + '\n');
            mailObj.files = distributorFiles;
            mailingist.push(mailObj);
        }
        await fs.appendFile(logFile, JSON.stringify(mailingist, undefined, 4) + '\n\n');
        
        for (const mailObj of mailingist) {
            $('#status').text('Sending Email: ' + JSON.stringify(mailObj, undefined, 4));
            sendEmailOutlookVbs(mailObj);
            await delay(5000);
        }
        $('#status').text('Finish');
        await fs.appendFile(logFile, 'End: ' + new Date().toISOString() + '\n\n');
    } catch (e) {
        $('#status').text(e.toString());
        console.error(e);
        await fs.appendFile(logFile, e.toString() + '\n\n');
    }
});

function sendEmail(email, password, mailObj) {
    const attachments = [];
    for (const file of mailObj.files) {
        attachments.push({ file });
    }
    const mailingOptions = {
        auth: {
            user: email,
            pass: password,
        },
        from: email,
        to: mailObj.to,
        subject: mailObj.subject,
        html: '<b>This is bold text</b>',
        text: 'This is text version!',
        replyTo: email,
        attachments: attachments,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i),
    };
    console.log(mailingOptions);
    nodeoutlook.sendEmail(mailingOptions);
}

function sendEmailOutlookVbs(mailObj) {
    vbs = spawn( 'cscript.exe', [ './send_mail.vbs', mailObj.to, mailObj.cc, mailObj.subject, mailObj.files.join() ] );
    console.log( `stderr: ${vbs.stderr.toString()}` );
    console.log( `stdout: ${vbs.stdout.toString()}` );
    console.log( `status: ${vbs.status}` );
}
