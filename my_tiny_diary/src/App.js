/*import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

import React from 'react';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
/*import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';*/
import {DB_CONFIG} from "./config_db";

class App extends React.Component{
    constructor(props){
        super(props);
        Firebase.initializeApp(DB_CONFIG.firebase);

        this.state = {
            developers: []
        }
    }

}
writeUserData = () => {
    Firebase.database().ref('/').set(this.state);
    console.log('DATA SAVED');
}

getUserData = () => {
    let ref = Firebase.database().ref('/');
    ref.on('value', snapshot => {
        const state = snapshot.val();
        this.setState(state);
    });
    console.log('DATA RETRIEVED');
}


function componentDidMount(){
    this.getUserData();
};

function componentDidUpdate(prevProps, prevState)  {
    // check on previous state
    // only write when it's different with the new state
    if (prevState !== this.state) {
        this.writeUserData();
    }
}


handleSubmit = (event) => {
    event.preventDefault();
    let name = this.refs.name.value;
    let role = this.refs.role.value;
    let uid = this.refs.uid.value;

    if (uid && name && role){
        const { developers } = this.state;
        const devIndex = developers.findIndex(data => {
            return data.uid === uid
        });
        developers[devIndex].name = name;
        developers[devIndex].role = role;
        this.setState({ developers });
    }
    else if (name && role ) {
        const uid = new Date().getTime().toString();
        const { developers } = this.state;
        developers.push({ uid, name, role })
        this.setState({ developers });
    }

    this.refs.name.value = '';
    this.refs.role.value = '';
    this.refs.uid.value = '';
};

removeData = (developer) => {
    const { developers } = this.state;
    const newState = developers.filter(data => {
        return data.uid !== developer.uid;
    });
    this.setState({ developers: newState });
};

updateData = (developer) => {
    this.refs.uid.value = developer.uid;
    this.refs.name.value = developer.name;
    this.refs.role.value = developer.role;
};

const render = () => {
    const { developers } = this.state;
    return(
        <div className="container">
            <div className="row">
                <div className='col-xl-12'>
                    <h1>Firebase Development Team</h1>
                </div>
            </div>
            <div className='row'>
                <div className='col-xl-12'>
                    {
                        developers
                            .map(developer =>
                                <div key={developer.uid} className="card float-left" style={{width: '18rem', marginRight: '1rem'}}>
                                    <div className="card-body">
                                        <h5 className="card-title">{ developer.name }</h5>
                                        <p className="card-text">{ developer.role }</p>
                                        <button onClick={ () => this.removeData(developer) } className="btn btn-link">Delete</button>
                                        <button onClick={ () => this.updateData(developer) } className="btn btn-link">Edit</button>
                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>
            <div className='row'>
                <div className='col-xl-12'>
                    <h1>Add new team member here</h1>
                    <form onSubmit={ this.handleSubmit }>
                        <div className="form-row">
                            <input type='hidden' ref='uid' />
                            <div className="form-group col-md-6">
                                <label>Name</label>
                                <input type="text" ref='name' className="form-control" placeholder="Name" />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Role</label>
                                <input type="text" ref='role' className="form-control" placeholder="Role" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default App;
