import * as React from 'react';

export default class Clicker extends React.Component<any, any> {

    public state = {
        count: 0,
    }

    public render() {
        const { state, inc } = this;

        return <div>
            <button onClick={inc}>click</button> {state.count}
        </div>;
    }

    protected inc = () => {
        this.setState((state) => {
            return {count: state.count + 1};
        });
    }
}