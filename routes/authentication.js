import express from 'express';
import ActiveDirectory from 'activedirectory2';
var router = express.Router();


router.post ('/', function (req, res) {

    var config = { url: 'ldap://ad.ucsd.edu',
        baseDN: '',
        username: req.body.username,
        password: req.body.password
    };

    var ad = new ActiveDirectory(config);

    ad.authenticate(req.body.username, req.body.password, function(err, auth) {
        if (err) {
            console.log('ERROR: '+JSON.stringify(err));
            return;
        }

        if (auth) {
            console.log('Authenticated with ' + req.body.username);
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
});

module.exports = router;
