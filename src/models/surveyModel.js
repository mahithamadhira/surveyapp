const jwt = require('jsonwebtoken');
const db = require("../models/db");
const dotenv = require("dotenv");

dotenv.config();
let id = 0;

exports.createSurvey = async (questions, userId, callback) => {
    try {
      const query = `SELECT MAX(question_id) FROM surveys`;
      const result = await db.surveysDb.run(query, []);
      id++;
      const surveys = [];
      var question_id = 0;
      for (const question of questions) {
        const questionText = question.question;
        const query = `INSERT INTO surveys (id, question_id, question, user_id) VALUES (?,?,?,?)`;
        question_id+=1;
        console.log(question_id);
        await db.surveysDb.run(query, [id,question_id, questionText, userId]);
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

exports.getSurvey = (id, callback) => {
    const query = "SELECT * FROM surveys WHERE id = ?";
    db.surveysDb.get(query, [id], (error, result) => {
        if (error) return callback(error);
        const surveys = [];
        callback(null, result);
    });
};

exports.getAllSurveys = (callback) => {
    const query = "SELECT * FROM surveys";
    db.surveysDb.all(query, (error, result) => {
        if (error) return callback(error);
        console.log(result);
        callback(null, result);
    });
};