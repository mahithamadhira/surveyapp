const surveyModel = require("../models/surveyModel");
const jwt = require("jsonwebtoken");
const db = require("../models/db");


exports.createSurvey =  (req, res) => {
    try {
      let userId = 1;
      let id = 0;
      let decoded;
  
      Promise.resolve()
        .then(() => {
          return new Promise((resolve, reject) => {
            jwt.verify(req.headers['x-access-token'], process.env.JWT_SECRET, (error, result) => {
              if (error){
                return res.status(401).send({ message: "Unauthorized." });
              } 
              decoded = result;
              resolve();
            });
          });
        })
        .then(() => {
          userId = decoded.id;
          return new Promise((resolve, reject) => {
            surveyModel.getSurvey((error, result) => {
              if (error) return res.status(500).send({ message: error.message });
              console.log("result in survey controller: ");
              console.log(result);
              id = result + 1;
              console.log(id);
              resolve();
            });
          });
        })
        .then(() => {
          return new Promise((resolve, reject) => {
            surveyModel.createSurvey(req.body.questions, userId, id, (error, surveys) => {
              if (error) return res.status(500).json({ message: error.message });
              res.status(200).json({
                questions: surveys,
                message: "Survey created successfully"
              });
              resolve();
            });
          });
        })
        .catch((error) => {
          res.status(500).json({ message: "Error creating survey" });
        });
    } catch (error) {
      res.status(500).json({ message: "Error creating survey" });
    }
  };
  
  
  
exports.takeSurvey = (req, res) => {
    const { id, answers } = req.body;
    var flag = 0;
    answers.forEach(element => {
        if(element != "yes" && element != "no"){
            flag = 1;
        }
    });

    if(flag == 1) return res.status(403).send({ message: "Answers can only be 'yes' or 'no'"});

    const query = `SELECT COUNT(*) as questionCount FROM surveys WHERE id = ?`;
    db.surveysDb.get(query, [id], (error, result) => {
        if (error) return res.status(500).send({ message: error.message });
        if (answers.length !== result.questionCount) {
            return res.status(400).send({ message: "Number of answers does not match number of questions" });
        }

       const answersWithId = answers.map((answer, index) => ({ id: id, question_id: index + 1, answer }));
       console.log(answersWithId);
        const promises = answersWithId.map(({ id, question_id, answer }) => new Promise((resolve, reject) => {
            const updateQuery = "UPDATE surveys SET answer = ? WHERE id = ? AND question_id = ?";
            db.surveysDb.run(updateQuery, [answer, id, question_id], (error) => {
                if (error) reject(error);
                resolve();
            });
        }));

        Promise.all(promises)
            .then(() => res.status(200).send({ message: "Survey taken successfully" }))
            .catch(error => res.status(500).send({ message: error.message }));
    });
};



exports.getResults = (req, res) => {
    surveyModel.getAllSurveys((error, result)=>{
        if (error) return res.status(500).send({ message: error.message });
        res.status(200).send(result);
    })
};

exports.getResultById = (req, res)=>{
    const id = req.params.id;
    surveyModel.getSurveyById(id, (error, result)=>{
        console.log(result);
        if (error) return res.status(500).send({ message: error.message });
        res.status(200).send(result);
    })
};