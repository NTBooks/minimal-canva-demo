import express from 'express';
import { codeChallenge, codeVerifier, getState } from "./encryption.js";
import dotenv from 'dotenv';
dotenv.config();
import {
    addAuthRecord,
    addDesignRecord,
    queryAuthByUser,
    updateAuthToken,
    updateUserToken,
    updateDesignRecord,
    queryDesignByUser

} from './sqlite.js';

import fs from 'fs';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import fileUpload from 'express-fileupload';
const urlencoded = bodyParser.urlencoded({ extended: true });

// Add express static 

// get approot path

const approot = process.cwd();



const app = express();


const port = process.env.PORT || 3000;

app.use(fileUpload({

}));

// middleware that adds req.userid as 100 for testing only, we're assuming our userid is 100 for testing only.
const requiresAuth = ((req, res, next) => {
    req.userid = 100;
    next();
});

function getCanvaAuthURL(state) {
    return process.env.CANVA_AUTH_URL
        .replace('<CLIENT_ID>', process.env.CANVA_CLIENT_ID)
        .replace('<CODE_CHALLENGE>', codeChallenge)
        .replace('<STATE>', state);

}

async function CanvaFetch(userid, apiroute, method = "GET", body = null) {

    const { usertoken } = await queryAuthByUser(userid);

    if (!usertoken) return null;


    return fetch('https://api.canva.com/rest/v1/' + apiroute, {
        method: method,
        headers: {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'application/json',

        },
        body: body ? JSON.stringify(body) : undefined
    });
}

// Use this for healthchecks.
app.get('/healthcheck', (req, res) => {
    res.send('OK');
});

app.get('/whoami', requiresAuth, async (req, res) => {
    const status = await queryAuthByUser(req.userid)
    if (!status) {
        return res.json({ userid: req.userid, status: { token: "NO_AUTH" } });
    }

    // todo: if token is going to expire, use refreshtoken

    res.json({ userid: req.userid, status: status.usertoken });
});


app.get('/canva/approve', requiresAuth, async (req, res) => {
    const state = getState();
    await addAuthRecord(req.userid, null, state, Date.now() + 1000 * 60 * 60 * 6);
    const canvaAuthURL = getCanvaAuthURL(state)
    res.redirect(canvaAuthURL);
});

app.get('/canva/redirect', requiresAuth, async (req, res) => {
    const token = req.query.code;
    const state = req.query.state;

    const credentials = Buffer.from(`${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`).toString('base64');

    const authresult = await updateAuthToken(req.userid, state, token);

    if (authresult && token) {

        const authtokenresult = await fetch("https://api.canva.com/rest/v1/oauth/token", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(`grant_type=authorization_code&code_verifier=${codeVerifier}&code=${token}`),
        });

        const authjson = await authtokenresult.json();
        if (authjson.error) return res.status(500).json({ error: authjson.error, error_description: authjson.error_description });
        // await addAuthRecord(req.userid, authjson.access_token, state, Date.now() + authjson.expires_in * 1000);

        await updateUserToken(req.userid, authjson.access_token);


        return res.sendFile('closewindow.html', { root: 'public' });
    }


    return res.sendFile('errormessage.html', { root: 'public' });


});


app.get("/", requiresAuth, async (req, res) => {

    // if we have acorrelation_jwt then this is a return request from canva
    const correlation_jwt = req.query.correlation_jwt;

    if (correlation_jwt) {
        // base64 decode it and parse it as JSON
        const base64Url = correlation_jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');

        // Parse the JSON payload
        const payload = JSON.parse(jsonPayload);

        // Assuming the payload contains a design ID
        const designId = payload.design_id;

        // TODO: verify correlation
        const userDesigns = await queryDesignByUser(req.userid);

        if (designId) {

            if (!userDesigns?.find(x => x.correlation_state === payload.correlation_state)) {
                return res.status(401).send("Invalid correlation state");
            };

            const canvaresult = await CanvaFetch(req.userid, `exports`, "POST", {
                "design_id": designId,
                "format": {
                    type: "png"
                }
            });

            const exportResult = await canvaresult.json();
            if (exportResult) {
                return res.redirect('/?waitid=' + exportResult?.job?.id);
            }
        }
    }

    return res.sendFile('index.html', { root: 'public' });
});

app.get("/newdesign", requiresAuth, async (req, res) => {


    const correlation_state = uuidv4();

    addDesignRecord(req.userid, correlation_state, JSON.stringify({}), "none", "none", Date.now() + 1000 * 60 * 60 * 6);

    const canvaresult = await CanvaFetch(req.userid, "designs", "POST", {
        "title": "ChainLetter Credential",
        "design_type": {
            "type": "preset",
            "name": "presentation"
        }
    });

    const canvapack = await canvaresult.json();
    if (!canvapack?.design) return res.send(canvapack);

    await updateDesignRecord(correlation_state, canvapack.design.urls.edit_url + `&correlation_state=${correlation_state}`, canvapack.design.urls.view_url);
    res.redirect(canvapack.design.urls.edit_url + `&correlation_state=${correlation_state}`);


});



app.post("/upload", requiresAuth, async (req, res) => {

    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    sampleFile = req.files.image;

    if (!fs.existsSync(approot + '/uploads/')) {
        fs.mkdirSync(approot + '/uploads/');
    }

    uploadPath = approot + '/uploads/' + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send({ success: true, message: 'File uploaded!' });
    });



    // Respond with a success message
    //res.json({ status: 'success' });
});

// app.get("/checkjob/:exportid", requiresAuth, async (req, res) => {
//     const exportid = req.params.exportid;

//     const canvaresult = await CanvaFetch(req.userid, `exports/${exportid}`, "POST", {
//         "design_id": designId,
//         "format": {
//             type: "png"
//         }
//     });

//     const exportResult = await canvaresult.json();
//     if (exportResult) {
//         //return res.redirect(exportResult.urls.png);
//         return res.send(exportResult);
//     }

// });


app.use(express.static('public'))



app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});