import express from 'express';
import ActiveDirectory from 'activedirectory2';
import bodyParser from 'body-parser';
var router = express.Router();

// parse application/json
router.use(bodyParser.json());

router.post ('/', function (req, res) {

    console.log ('logging in');

    var config = {
        url: 'ldap://ad.ucsd.edu',
        baseDN: '',
    };

    let responseSent = false;

    var ad = new ActiveDirectory(config);
    console.log ('authenticating ' + req.body.email);

    ad.authenticate(req.body.email, req.body.password, function(err, auth) {
        if (err) {
            console.log ("Failure");
            res.json ({
                success:false
            });
            //
            // if (!responseSent) {
            //     res.status(500).send ({'error': 'Login failed!'});
            // }
            // responseSent = true;
        }

        else if (auth) {
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
});

module.exports = router;
