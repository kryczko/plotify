import React from 'react';
import { render } from 'react-dom';
import Dropzone from 'react-dropzone';
import { LineChart } from 'plottr';


class Table extends React.Component {
    render() {
        const data = this.props.data;
        if (data.length > 0) {
            return (
                    <table className="table-striped">
                        <thead>
                            <tr>
                                {
                                    data[0].map(( elem, i ) => {
                                        return <th key={i}> Column {i} </th>
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
                                                        return <td key={i+j}> {elem} </td>
                                                    })
                                                }
                                            </tr>
                                        )
                                })
                            }
                        </tbody>
                    </table>
                )
        } else {
            return <div> You have no data </div>
        }
    }
}


class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.state;
    }

    render() {
        const {
            Load, 
            Inspect,
            Plot,
        } = this.state;

        return (
            <div>
                <div className="tab-group">
                  <div className={"tab-item " + (Load ? "active" : "")} onClick={this.props.onClick}>
                    <span className="icon"></span>
                    Load
                  </div>
                  <div className={"tab-item " + (Inspect ? "active" : "")} onClick={this.props.onClick}>
                    <span className="icon"></span>
                    Inspect
                  </div>
                  <div className={"tab-item " + (Plot ? "active" : "")} onClick={this.props.onClick}>
                    <span className="icon"></span>
                    Plot
                  </div>
                </div>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            visible: {
                Load: true,
                Inspect: false,
                Plot: false
            }
        };
        this.openFile = this.openFile.bind(this);
        this.onClick = this.onClick.bind(this);
        this.OnButtonClick = this.OnButtonClick.bind(this);
    }

    openFile(files) {
        let fileName = files[0].path;
        const data = fs.readFileSync(fileName);
        const lines = data.toString().split('\n');
        const splitData = lines.map(each => {
            const line = each.split(' ');
            return line.filter(elem => {
                return elem != '';
            })
        });
        this.setState({data: splitData, visible: {Load: false, Inspect: true, Plot: false}});
    }

    onClick(event) {
        const name = event.target.children[1].innerHTML;
        const visible = this.state.visible;
        for (var key in visible) {
            if (key === name) {
                visible[key] = true;
            } else {
                visible[key] = false;
            }
        }
        this.setState({ visible });
    }

    OnButtonClick(event) {
        this.setState({visible: {Load: false, Inpect: false, Plot: true}})
    }

    render() {
        const {
            data,
            visible
        } = this.state;
        if (visible.Load) {
            return (
                <div>
                    <Nav state={visible} onClick={this.onClick} />
                    <Load onDrop={this.openFile}/>
                </div>
                ) 
        } else if (visible.Inspect) {
            return (
                <div>
                    <Nav state={visible} onClick={this.onClick}/>
                    <Inspect data={data} OnButtonClick={this.OnButtonClick}/>
                </div>
                )
        } else {
            return (
                <div>
                    <Nav state={visible} onClick={this.onClick}/>
                    <Plot data={data} />
                </div>
                )
        }
    }
}

class Load extends React.Component {
    render() {
        return (
            <div>
                <Dropzone className="default" style={{alignItems: 'center'}} onDrop={this.props.onDrop}>
                    <h1 style={{fontSize: '4vw', cursor: 'pointer', margin: '0 10% 0'}}>Drag or click anywhere to load data.</h1>
                </Dropzone>
            </div>
        )
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
        )
    }
}

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
        )
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