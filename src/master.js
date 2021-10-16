
const
    spawn = require( 'child_process' ).spawnSync,
    vbs = spawn( 'cscript.exe', [ './send_mail.vbs', 'codecaplet@gmail.com', 'codecaplet@gmail.com', 'Hello', 'C:\\Users\\sharm\\Desktop\\bulk-mailer\\1 sa.xlsx,C:\\Users\\sharm\\Desktop\\bulk-mailer\\1 safd.xlsx' ] );

console.log( `stderr: ${vbs.stderr.toString()}` );
console.log( `stdout: ${vbs.stdout.toString()}` );
console.log( `status: ${vbs.status}` );