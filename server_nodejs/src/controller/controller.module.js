const { URL_CONFIG } = require('../shared/url.constant');

module.exports = api => {
    api.use(`${URL_CONFIG.API_V1}/user`, require('./user.controller'));
    api.use(`${URL_CONFIG.API_V1}/subject`, require('./subject.controller'));
    api.use(`${URL_CONFIG.API_V1}/chapter`, require('./chapter.controller'));
    api.use(`${URL_CONFIG.API_V1}/question`, require('./question.controller'));
    // api.use(`${URL_CONFIG.API_V1}/question`, require('./question.controller'));
    // api.use(`${URL_CONFIG.API_V1}/question`, require('./question.controller'));
};