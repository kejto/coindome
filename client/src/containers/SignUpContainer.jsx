import React from 'react';
import { Redirect } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import TranslationContainer from './TranslationContainer';

class SignUpContainer extends React.Component {
  constructor(props) {
    super(props);
    // set the initial component state
    this.state = {
      redirect: false,
      errors: {},
      user: {
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
      },
    };

    this.processForm = this
      .processForm
      .bind(this);
    this.changeUser = this
      .changeUser
      .bind(this);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({ user });
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const confirmPassword = encodeURIComponent(this.state.user.confirmPassword);
    const formData = `name=${name}&email=${email}&password=${password}`;

    if (password != confirmPassword) {
      const errors = {};
      errors.password = <TranslationContainer translationKey="match_password_text" />;
      this.setState({ errors });
    } else {
      // create an AJAX request
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/auth/signup');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Accept-Language', localStorage.getItem('lang'));
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success change the component-container state
          this.setState({ errors: {} });

          // set a message
          localStorage.setItem('successMessage', xhr.response.message);
          this.setState({ redirect: true });
        } else {
          // failure

          const errors = xhr.response.errors
            ? xhr.response.errors
            : {};
          errors.summary = xhr.response.message;

          this.setState({ errors });
        }
      });
      xhr.send(formData);
    }
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <div>
        {this.state.redirect === false
          ? (
            <SignUpForm
              onSubmit={this.processForm}
              onChange={this.changeUser}
              errors={this.state.errors}
              user={this.state.user}
            />
          )
          : (<Redirect to="/login" />)
}
      </div>
    );
  }
}

export default SignUpContainer;
