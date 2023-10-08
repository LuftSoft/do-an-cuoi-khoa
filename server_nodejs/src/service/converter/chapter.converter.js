module.exports = {
    convertDataToModel: (model, dto) => {
        model.name = dto.name;
        model.subject_id = dto.subject_id;
        return model;
    }
}