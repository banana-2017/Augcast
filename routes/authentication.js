import express from 'express';
//import ActiveDirectory from 'activedirectory2';
import bodyParser from 'body-parser';
import SSH from 'simple-ssh';
import {sshUser, sshPass} from '../utility/sshCredentials.json';
var router = express.Router();

// parse application/json
router.use(bodyParser.json());

router.post ('/', function (req, res) {

/**
 LDAB Authentication could go here instead of the SSHing
 */

    var ssh = new SSH({
        host: 'ieng6-202.ucsd.edu',
        user: sshUser,
        pass: sshPass
    });

    ssh.exec('java ActiveDirectoryUtils '+req.body.email+' '+req.body.password, {
        out: function(stdout) {

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

LDAB Authentication

    var config = {
        url: 'ldap://ad.ucsd.edu',
        baseDN: '',
    };

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
