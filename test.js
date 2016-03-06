import React from 'react';
import { render } from 'react-dom';
class Test extends React.Component {
    render() {
         return <h1 style={{textAlign: 'center'}}>This is the test page.</h1>
    }
}


render(
    <Test/>,
    document.getElementById('example')
);

export default Test;