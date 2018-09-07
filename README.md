# Coindome

This is blueprint for react app with nodejs.<br />
Its using mongolab for mongodb and heroku for hosting<br />
User password is hashed in DB,<br />
Redux is used for translations and currency (visible after login)<br />
React FE is addressing Node backend via Apollo graphQL
<br />
Use GraphiQL console for query data for Bitcoin diagram
<br />
Audit results<br />
![alt text](https://github.com/kejto/coindome/blob/master/client/public/images/results.jpg)

to analyze FE bundles run "yarn analyze"

### Hosted on Heroku
https://coindome.herokuapp.com/

### Installing

yarn localinstall

## Getting Started

"yarn start"

### Prerequisites

VS Code

### TechStack 
jwt<br />
webpack 4<br />
babel<br />
sourcemap<br />
bootstrap 4<br />
redux<br />
apollo<br />
graphql<br />
mongoose<br />
heroku<br />
yarn <br />
elsint<br />
gzip<br />
cors<br />
express<br />

## Authors

* **Lubos Kato** - *Initial work* - [kejto](https://github.com/kejto)

## License

This project is licensed under the MIT License

## Acknowledgments

* credits for jwt oauth 2.0 implementation https://vladimirponomarev.com/blog/authentication-in-react-apps-jwt

## TODO
* add reset password functionality
* include tests
* implement CI builds with heroku
