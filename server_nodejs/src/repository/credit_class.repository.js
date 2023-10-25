const { QueryTypes } = require("sequelize");
const dbContext = require("../database/models/config/dbContext");
const { Helpers } = require("../extension/helper");
const credit_classes = dbContext.credit_classes;

module.exports = {
  create: async (credit_class) => {
    const transaction = await credit_classes.sequelize.transaction();
    var credit_classCreate = {};
    try {
      const query = `COALESCE((SELECT cc.class_code FROM credit_classes AS cc ORDER BY class_code DESC LIMIT 1),'PTITHCM100000');
    SET @class_code =(CASE WHEN @class_code IS NOT NULL THEN CONCAT(SUBSTRING(@class_code, 1,4),CONVERT(((CONVERT(SUBSTRING(@class_code, 5), SIGNED)) + 1), CHAR))ELSE 'PTIT1001'END);
    INSERT INTO credit_classes(class_code, semester_id, subject_id) values(@class_code,${credit_class.semester_id},'${credit_class.subject_id}');`;
      const newest_class_code = await credit_classes.sequelize.query(
        `SELECT (COALESCE((SELECT cc.class_code FROM credit_classes AS cc ORDER BY class_code DESC LIMIT 1),'LTC100000')) as class_code`,
        { type: QueryTypes.SELECT }
      );
      let tmp = newest_class_code[0].class_code;
      let new_class_code =
        tmp.substring(0, 4) + (Number.parseInt(tmp.slice(4)) + 1).toString();
      credit_classCreate = await credit_classes.sequelize.query(
        `INSERT INTO credit_classes(class_code, semester_id, subject_id) values('${new_class_code}',${credit_class.semester_id},'${credit_class.subject_id}')`,
        { type: QueryTypes.INSERT }
      );
      await transaction.commit();
    } catch (err) {
      console.log(err);
      await transaction.rollback();
    }
    return credit_classCreate;
  },
  update: async (credit_class) => {
    await credit_class.save();
    return credit_class;
  },
  delete: async (id) => {
    const result = await credit_classes.destroy({
      where: {
        id: id,
      },
      truncate: true,
    });
    return result;
  },
  getById: async (id) => {
    const credit_class = await credit_classes.findByPk(id);
    return credit_class;
  },
  getAll: async () => {
    const query = `SELECT cc.*, sj.name as subject_name, sm.semester as semester_semester, sm.year as semester_year
    FROM credit_classes as cc,subjects as sj, semesters as sm 
    WHERE cc.subject_id = sj.id AND cc.semester_id = sm.id `;
    const listcredit_class = await credit_classes.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    return listcredit_class;
  },
};
