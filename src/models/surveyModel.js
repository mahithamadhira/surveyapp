const jwt = require('jsonwebtoken');
const db = require("../models/db");
const dotenv = require("dotenv");

dotenv.config();

exports.createSurvey = (questions, userId, id, callback) => {
    try {
      console.log("Value of id in create survey model");
      console.log(id);
      const surveys = [];
      var question_id = 0;
      for (const question of questions) {
        const questionText = question.question;
        const query = `INSERT INTO surveys (id, question_id, question, user_id) VALUES (?,?,?,?)`;
        question_id+=1;
        db.surveysDb.run(query, [id,question_id, questionText, userId]);
        surveys.push({ surveyId: id , questionId: question_id, question: questionText });
      }
      callback(null, surveys);
    } catch (error) {
      callback({ message: "Error creating survey" });
    }
  };

exports.getAllSurveys = (callback) => {
    const query = "SELECT * FROM surveys";
    db.surveysDb.all(query, [], (error, result) => {
    if (error) return callback({ message: error.message });
    callback(null, result);
    });
}; 

exports.getSurvey = async (callback) => {
    const query = "SELECT MAX(id) AS id FROM surveys";
    db.surveysDb.get(query, (error, result) => {
      console.log("result in getSurvey function")
      console.log(result);
      if(result == null || result.id == null) return callback(null, 0)
        if (error) return callback(error);
        const surveys = [];
        callback(null, result.id);
    });
};

exports.getSurveyById = async (id, callback) => {
  const query = "SELECT id FROM surveys ORDER BY id DESC LIMIT 1";
  db.surveysDb.get(query, (error, result) => {
    console.log(result);
      if (error) return callback(error);
      const surveys = [];
      callback(null, result);
  });
};
