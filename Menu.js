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
                    <Link className='tab-item' activeClassName='active' to='/load'>
                        <span className="icon"></span>
                        Load
                    </Link>
                    <Link className='tab-item' activeClassName='active' to='/inspect'>
                        <span className="icon"></span>
                        Inspect
                    </Link>
                    <Link className='tab-item' activeClassName='active' to='/plot'>
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
    }

    OnButtonClick(event) {
        this.setState({visible: {Load: false, Inpect: false, Plot: true}})
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
                <Dropzone className="default" style={{ alignItems: 'center' }} onDrop={this.context.openFile}>
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
            return <div> You have no data </div>;
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
                <div className="default">
                    <Table data={this.props.data} />
                </div>
                {
                    this.props.data.length != 0 ?
                        <button style={{position: 'absolute', bottom: '10', float: 'center'}} className="btn btn-large btn-primary" onClick={this.props.OnButtonClick}>Plot your data!</button> : <div/>
                }
            </div>
        );
    }
}
Inspect.contextTypes = {
    data: React.PropTypes.array
};

class Plot extends React.Component {
    constructor(props) {
        super(props);
        const beforeData = this.props.data;
        // do something with before data and turn it into after data
        const xs = beforeData.map(line => {
            return parseFloat(line[0]);
        });
        const y = beforeData.map(line => {
            return parseFloat(line[1]);
        });

        const afterData = { x: xs, ys: [y] };

        this.state = {
            data: {data: afterData}
        };
    }
    render() {
        const {
            data
        } = this.state;
        console.log(data);
        return (
            <div>
                <LineChart data={data} style={{width: '80%'}}/>
            </div>
        );
    }
}


render(
    <App/>,
    document.getElementById('example')
);

export {
    App,
    Load,
    Inspect,
    Plot
    }
