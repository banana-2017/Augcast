import express from 'express';
//import ActiveDirectory from 'activedirectory2';
import bodyParser from 'body-parser';
import SSH from 'simple-ssh';
import CryptoJS from 'crypto-js';
import {sshUser, sshPass} from '../utility/sshCredentials.js';
import {encryptionKey, encryptionIv} from '../utility/encryption.js';
var router = express.Router();

// parse application/json
router.use(bodyParser.json());

var cryptEncryptionKey = CryptoJS.enc.Base64.parse(encryptionKey);
var cryptEncryptionIv = CryptoJS.enc.Base64.parse(encryptionIv);

var encryptString = function (stringToEncrypt) {
    var utf8Stringified = CryptoJS.enc.Utf8.parse(stringToEncrypt);
    var encrypted = CryptoJS.AES.encrypt(utf8Stringified.toString(), cryptEncryptionKey,
        {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: cryptEncryptionIv});
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};


router.post ('/', function (req, res) {

/**
 LDAP Authentication could go here instead of the SSHing
 */

/**
                res.json ({
                    success:true
                });
return;
*/

    var ssh = new SSH({
        host: 'ieng6-202.ucsd.edu',
        user: sshUser,
        pass: sshPass
    });

    let encryptedEmail = encryptString(req.body.email);
    let encryptedPass = encryptString(req.body.password);

    console.log ('Logging in ' + encryptedEmail + ' ' + encryptedPass);

    ssh.exec('java -cp ./commons-codec-1.10.jar:. ActiveDirectoryUtils "'+encryptedEmail+'" "'+encryptedPass+ '"', {
        out: function(stdout) {
            console.log ('Login stdout: '+ stdout);
            if (stdout === 'true') {
                console.log ('User authenticated!');
                res.json ({
                    success:true
                });
            }
            else {
                console.log ('User authentication failed');
                res.json ({
                    success:false
                });
            }

            ssh.end();
        }
    }).start();

});


module.exports = router;

/*

LDAP Authentication

    var config = {
        url: 'ldap://ad.ucsd.edu',
        baseDN: '',
    };

res.json({success:true});
return;


var ad = new ActiveDirectory(config);
    console.log ('authenticating ' + req.body.email);

    ad.authenticate(req.body.email, req.body.password, function(err, adAuth) {
        if (err) {
            res.json ({
                success:false
            });
        }

        else if (adAuth) {
            console.log('Authenticated with ' + req.body.email);
            res.json ({
                success: true
            });
        }

        else {
            console.log('Authentication failed!');
            res.json ({
                success: false
            });
        }
    });
*/
