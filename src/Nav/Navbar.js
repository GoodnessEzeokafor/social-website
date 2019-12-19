import React, { Component } from 'react';
import Identicon from 'identicon.js';

export default class Navbar extends Component {
    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-dark primary-color">

            <a class="navbar-brand">{this.props.dapp_name}</a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav"
            aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="basicExampleNav">

            <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
            <a className="nav-link">
                <small>
                {this.props.account}
            <span className="sr-only">(current)</span>
            </small>
            {this.props.account
             ? <img className="ml-2" 
             width="30"
             height="30"
             src={`data:image/png;base64, ${ new Identicon(this.props.account, 30).toString()}`}
             />
             : <span> </span>
            }
            </a>
            
                
            </li>
            </ul>

            </div>
            </nav>  
        );
    }
}