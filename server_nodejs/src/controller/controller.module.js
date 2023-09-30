const { URL_CONFIG } = require('../shared/url.constant');

module.exports = api => api.use(`${URL_CONFIG.API_V1}/user`, require('./user.controller'));