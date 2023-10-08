module.exports = {
    convertDataToModel: (model, dto) => {
        model.question = dto.question;
        model.level = dto.level;
        model.chapter_id = dto.chapter_id;
        return model;
    }
}