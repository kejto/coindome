import React from 'react';

class Dropdown extends React.Component {
  constructor() {
    super();

    this.state = {
      displayMenu: false,
    };

    this.showDropdownMenu = this
      .showDropdownMenu
      .bind(this);
    this.hideDropdownMenu = this
      .hideDropdownMenu
      .bind(this);
  }

  showDropdownMenu(event) {
    event.preventDefault();
    this.setState({
      displayMenu: true,
    }, () => {
      document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({
      displayMenu: false,
    }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });
  }

  render() {
    return (
      <div
        className="dropdown"
        style={{ width: '200px' }}
      >
        <div className="button2" onClick={this.showDropdownMenu}>USD</div>
        { this.state.displayMenu
          ? (
            <ul>
              <li>
                <a className="active" href="#USD">USD</a>
              </li>
              <li>
                <a href="#EUR">EUR</a>
              </li>
            </ul>
          )
          : (null)
        }
      </div>
    );
  }
}

export default Dropdown;
