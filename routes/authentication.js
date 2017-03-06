import express from 'express';
import ActiveDirectory from 'activedirectory2';
import bodyParser from 'body-parser';
var router = express.Router();

// parse application/json
router.use(bodyParser.json());

router.post ('/', function (req, res) {

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
});

module.exports = router;
