const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const publicFolder = path.join(__dirname, 'public');
const ai = new GoogleGenAI({});

// APP SETTINGS SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', true);

// MIDDLEWARE USE - SHORT SETUP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicFolder, {
	maxAge: '7d', // changed '1y' rather than using cache busting
	etag: false
}));

// MIDDLEWARE SETUP - LONG VERSION
app.use(
	helmet.contentSecurityPolicy({
		directives: {
                	defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    imgSrc: ["'self'", "data:"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                    connectSrc: ["'self'"]
		}
}));

app.use(
	helmet.hsts({
		maxAge: 2592000, // 1year
		
	})
);

const sanitizeInput = (input) => {
	return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 10, // 5 requests
});
app.use('/confess', limiter);

const corsOptions = {
        origin: [
                'http://localhost:8000',
                'https://biruksendeku.com',
                'https://biruksendeku.onfirebase.com',
                'https://biruksendeku.onrender.com'
        ],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // allow cookies/auth headers
        optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// CRUD OPERATION
app.get('/', (req, res) => {
	try {
		res.status(200).render('home');
	} catch(err) {
		next(err);
	}
});

app.post('/confess', [
    check('prompt')
    .trim()
    .escape()
], async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('confess', {
            errors: errors.array(),
            confession: null,
            error: null,
            prompt: req.body.prompt
        });
    }

    try {
        let { prompt } = req.body;
        
        if (!prompt || typeof prompt !== "string") {
            return res.render('confess', {
                confession: null,
                error: 'Invalid confession idea.',
                prompt: prompt
            });
        }

        prompt = sanitizeInput(prompt.trim());

        // CONFESSING
        let confessionPrompt = `Write a heartfelt university confession (max 120 words) based on: "${prompt}". Make it genuine, slightly nervous, end hopeful. Sometimes Gen Z English. No names, just descriptions. Output confession only.`;

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: confessionPrompt,
        });

        if (!result || !result.candidates || !result.candidates[0]) {
            throw new Error('Invalid response from AI service - no candidates');
        }

        const candidate = result.candidates[0];
        if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
            throw new Error('Invalid response from AI service - no content parts');
        }

        const confessionText = candidate.content.parts[0].text.trim();

        // Success - render with confession data
        res.render('confess', {
            confession: {
                text: confessionText,
                timestamp: Date.now()
            },
            error: null,
            prompt: prompt
        });

    } catch (error) {
        console.error("Gemini AI Error:", error);
        res.render('confess', {
            confession: null,
            error: 'Failed to generate confession. Please try again in a moment.',
            prompt: req.body.prompt
        });
    }
});

app.get('/donate', (req, res) => {
	try {
		res.status(200).render('donate');
	} catch(err) {
		next(err);
	}
});

app.get('/examples', (req, res) => {
	try {
		res.status(200).render('examples');
	} catch(err) {
		next(err);
	}
});

app.get('/updates', (req, res) => {
	try {
		res.status(200).render('updates');
	} catch(err) {
		next(err);
	}
});

app.get('/faq', (req, res) => {
	try {
		res.status(200).render('faq');
	} catch(err) {
		next(err);
	}
});

app.get('/privacy', (req, res) => {
	try {
		res.status(200).render('privacy');
	} catch(err) {
		next(err);
	}
});

app.get('/terms', (req, res) => {
	try{
		res.status(200).render('terms');
	} catch(err) {
		next(err);
	}
});

app.use((req, res, next) => {
	try {
		res.status(404).render('404');
	} catch(err) {
		next(err);
	}
});

app.use((err, req, res, next) => {
	//res.status(500).send('Internal Server Error!');
	res.status(500).render('500');
	console.log('Error Message: ', err.message);
	console.log('Error Stack: ', err.stack);
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});
