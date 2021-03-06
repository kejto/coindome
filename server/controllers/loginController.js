const passport = require('passport');
const { t } = require('localizify');
const Token = require('mongoose').model('Token');
require('../passport/passport')();
const validation = require('../validation/loginValidation');

var loginController = function(User) {
var signup = function(req, res, next){
    const validationResult = validation.validateSignupForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }
  
    return passport.authenticate('local-signup', (err) => {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // the 11000 Mongo code is for a duplication email error
          // the 409 HTTP status code is for conflict error
          if(err.message.indexOf("$email") > -1){
            return res.status(409).json({
              success: false,
              message: t('errors'),
              errors: {
                email: t('emailTaken'), 
              }
            });
          }
          if(err.message.indexOf("$name") > -1){
            return res.status(409).json({
              success: false,
              message: t('errors'),
              errors: {
                name: t('nameTaken')
              }
            });
          }
        }

        return res.status(400).json({
          success: false,
          message: t('formProcessError')
        });
      }
  
      return res.status(200).json({
        success: true,
        message: t('registerSucccess')
      });
    })(req, res, next);
  };

  var login = function (req, res, next) {
    const validationResult = validation.validateLoginForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }
  
    return passport.authenticate('local-login', (err, token, userData) => {
      if (err) {
        if (err.name === 'IncorrectCredentialsError') {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
  
        return res.status(400).json({
          success: false,
          message: t('formProcessError')
        });
      }
      
      return res.json({
        success: true,
        message: t('loginSucccess'),
        token,
        user: userData
      });
    })(req, res, next);
  };

var getuser = function (req, res, next) {
    // Find a matching token
    Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token) return res.status(400).send({ type: 'not-verified', msg: t('unableVerify') });
  
      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, function (err, user) {
          if (!user) return res.status(400).send({ msg: t('noUserFound') });
              if (err) { return res.status(500).send({ msg: err.message }); }
              return res.status(200).json({
                email: user.email,
                name: user.name,
              });
          });
      });
  };

  return{
    signup: signup,
    login: login,
    getuser: getuser,
  }
}

  module.exports = loginController;
  