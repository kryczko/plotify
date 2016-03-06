import React from 'react';
import { Link } from 'react-router';
import { render } from 'react-dom';
import Dropzone from 'react-dropzone';
import { LineChart } from 'plottr';



class Nav extends React.Component {
    render() {
        return (
            <div>
                <div className="tab-group">
                    <Link style={{ textDecoration: 'none', color: '#555'}} className='tab-item' activeClassName='active' to='/load'>
                        <span className="icon"></span>
                        Load
                    </Link>
                    <Link style={{ textDecoration: 'none', color: '#555' }} className='tab-item' activeClassName='active' to='/inspect'>
                        <span className="icon"></span>
                        Inspect
                    </Link>
                    <Link style={{ textDecoration: 'none', color: '#555' }} className='tab-item' activeClassName='active' to='/plot'>
                        <span className="icon"></span>
                        Plot
                    </Link>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    getChildContext() {
        return {
            data: this.state.data,
            openFile: this.openFile.bind(this)
        };
    }

    openFile(files) {
        let fileName = files[0].path;
        const file = fs.readFileSync(fileName);
        const lines = file.toString().split('\n');
        const data = lines.map(each => {
            const line = each.split(' ');
            return line.filter(elem => {
                return elem != '';
            });
        });
        this.setState({ data });
        location.hash = '/inspect';
    }

    render() {
        return (
            <div>
                <Nav />
                { this.props.children }
            </div>
        );
    }
}
App.childContextTypes = {
    data: React.PropTypes.array,
    openFile: React.PropTypes.func
};

class Load extends React.Component {
    render() {
        return (
            <div>
                <Dropzone className="default" style={{ alignItems: 'center', cursor: 'pointer' }} onDrop={this.context.openFile}>
                    <h1 style={{ fontSize: '4vw', cursor: 'pointer', margin: '0 10% 0'}}>Drag or click anywhere to load data.</h1>
                </Dropzone>
            </div>
        );
    }
}
Load.contextTypes = {
    openFile: React.PropTypes.func
};

class Table extends React.Component {
    render() {
        const data = this.props.data;

        if(!data.length) {
            return (
                <div> 
                    <p style={{ fontSize: '4vw'}}> You have not loaded data yet.</p>
                </div>
                )
        }

        return (
                <table className="table-striped">
                    <thead>
                        <tr>
                            {
                                data[0].map(( elem, i ) => {
                                    return <th key={i}> Column {i} </th>;
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((line,i) => {
                                return (
                                        <tr key={i}>
                                            {
                                                line.map((elem, j) => {
                                                    return <td key={i+j}> {elem} </td>;
                                                })
                                            }
                                        </tr>
                                    );
                            })
                        }
                    </tbody>
                </table>
            );
    }
}

class Inspect extends React.Component {
    render() {
        return (
            <div>
                {
                        this.context.data.length === 0 ?
                            <div className="default" style={{alignItems: 'center', flexDirection: 'column'}}>
                                <Table data={this.context.data} />
                                <button style={{}} className="btn btn-large btn-primary" onClick={() => { location.hash = '/load'; }}>GO BACK AND LOAD DATA</button>
                            </div> : 
                            <div>
                                <Table style={{top: '0'}} data={this.context.data} />
                                <button style={{position: 'absolute', bottom: '25', left: '10%'}} className="btn btn-large btn-positive" onClick={() => { location.hash = '/plot'; }}>PLOT YOUR DATA</button>
                                <button style={{position: 'absolute', bottom: '25', right: '10%'}} className="btn btn-large btn-negative" onClick={() => {this.context.data = []}}>REMOVE DATA</button>
                            </div>
                }
            </div>
        );
    }
}
Inspect.contextTypes = {
    data: React.PropTypes.array
};

class Plot extends React.Component {
    constructor(props, context) {
        super(props);

        const afterData = context.data.map(line => {
            return { x: parseFloat(line[0]), ys: [parseFloat(line[1])] };
        });

        this.state = {
            data: { data: afterData }
        };
    }

    render() {
        const {
            data
        } = this.state;

        return (
            <div>
            {
            this.context.data.length === 0 ?
                <div className="default" style={{alignItems: 'center', flexDirection: 'column'}}>
                    <Table data={this.context.data} />
                    <button style={{}} className="btn btn-large btn-primary" onClick={() => { location.hash = '/load'; }}>GO BACK AND LOAD DATA</button>
                </div> :
                <div>
                    <LineChart data={data} style={{width: '80%'}}/>
                </div>
            }
            </div>
        );
    }
}
Plot.contextTypes = {
    data: React.PropTypes.array
};


render(
    <App/>,
    document.getElementById('example')
);

export {
    App,
    Load,
    Inspect,
    Plot
    };
