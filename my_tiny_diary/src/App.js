import React from 'react';
import Firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import {DB_CONFIG} from "./config_db";

class App extends React.Component {
    constructor(props) {
        super(props);
        Firebase.initializeApp(DB_CONFIG);

        this.state = {
            memory: []
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


    componentDidMount() {
        this.getUserData();
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            this.writeUserData();
        }
    }


    handleSubmit = (event) => {
        event.preventDefault();
        let name = this.refs.name.value;
        let role = this.refs.role.value;
        let uid = this.refs.uid.value;

        if (uid && name && role) {
            const { memory } = this.state;
            const devIndex = memory.findIndex(data => {
                return data.uid === uid
            });
            memory[devIndex].name = name;
            memory[devIndex].role = role;
            this.setState({ memory });
        }
        else if (name && role) {
            const uid = new Date().getTime().toString();
            const { memory } = this.state;
            memory.push({ uid, name, role })
            this.setState({ memory });
        }

        this.refs.name.value = '';
        this.refs.role.value = '';
        this.refs.uid.value = '';
    };

    removeData = (arg) => {
        const { memory } = this.state;
        const newState = memory.filter(data => {
            return data.uid !== arg.uid;
        });
        this.setState({ memory: newState });
    };

    updateData = (arg) => {
        this.refs.uid.value = arg.uid;
        this.refs.name.value = arg.name;
        this.refs.role.value = arg.role;
    };

    render = () => {
        const { memory } = this.state;
        return (
            <div className="container">
                <div className='row'>
                    <div className='col-xl-12'>
                        <h1>Add Memory Here</h1>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group row">
                                <input type='hidden' ref='uid' />

                                <label htmlFor="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Name</label>
                                <div className="col-sm-6">
                                    <input type="text" ref='name' className="form-control form-control-sm" placeholder="Name" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Description</label>
                                <div className="col-sm-6">
                                    <textarea type="text" ref='role' className="form-control" placeholder="Description" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success">Save</button>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className='col-xl-12'>
                        <h1>Stored Memory</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xl-12'>
                        {
                            memory
                                .map(x =>
                                    <div key={x.uid} className="card float-left" style={{ width: '18rem', marginRight: '1rem' }}>
                                        <div className="card-body">
                                            <h5 className="card-title">{x.name}</h5>
                                            <p className="card-text">{x.role}</p>
                                            <button onClick={() => this.removeData(x)} className="btn btn-danger">Delete</button>
                                            <button onClick={() => this.updateData(x)} className="btn btn-primary">Edit</button>
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default App;
