const { Nuxt } = require('nuxt');

/**
 * Sets mode to production.
 */
const config = {
    dev: false,
    debug: true
};

/**
 * Initializes nuxt object.
 */
const nuxt = new Nuxt(config);

let isReady = false;

/**
 * Promise to check if nuxt is ready.
 */
const readyPromise = nuxt
    .ready()
    .then(() => {
        isReady = true
        return null
    })
    .catch(() => {
        process.exit(1)
    });

/**
 * The function handles all requests and renders the page for that route.
 * 
 * @param {object} req - request object.
 * @param {object} res - response object.
 */
async function handleRequest(req, res) {
    if (!isReady) {
        await readyPromise;
    }
    res.set('Cache-Control', 'public, max-age=1, s-maxage=1');
    await nuxt.render(req, res);
}

module.exports = handleRequest;