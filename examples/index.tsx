import * as React from 'react';
import { render } from 'react-dom';
import Modal from '../src';
import Clicker from './Clicker';
import './styles.scss';

class ExampleComponent extends React.Component<any, any> {

    public state = {
        showA: false,
        showB: false,
    }

    protected parent: HTMLElement;

    public render() {
        const { state, showA, hideA, showB, hideB } = this;

        return <div ref={(r) => r && (this.parent = r)}>
            <p>
                <button onClick={showA}>show A modal</button>
            </p>
            <Modal
                show={state.showA}
                onCloseRequest={hideA}
                allowScroll
            >
                <div>
                    <p>modal A body contents (hit ESC to close) <button onClick={showB}>show B modal</button></p>
                    <Clicker />
                    <Modal
                        show={state.showB}
                        onCloseRequest={hideB}
                    >
                        <p>modal B body contents <a href="#" onClick={(e) => {
                            e.preventDefault();
                            hideB();
                        }}>close</a></p>
                        <Clicker />
                    </Modal>
                </div>
            </Modal>
        </div>;
    }

    protected showA = () => {
        this.setState({ showA: true });
    }

    protected hideA = () => {
        this.setState({ showA: false });
    }

    protected showB = () => {
        this.setState({ showB: true });
    }

    protected hideB = () => {
        this.setState({ showB: false });
    }
}

render(<ExampleComponent />, document.getElementById('app'));