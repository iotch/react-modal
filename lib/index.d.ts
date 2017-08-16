/// <reference types="react" />
import * as React from 'react';
import { Component } from 'react';
/**
 * Modal window component
 */
export default class Modal extends Component<Props, any> {
    /**
     * Default props
     * @type {Props}
     */
    static defaultProps: Props;
    /**
     * Instance id
     * @type {string | number}
     */
    protected id: string | number;
    /**
     * Rendered modal element
     * @type {HTMLElement}
     */
    protected element: HTMLElement;
    /**
     * Previously focused element
     * @type {any}
     */
    protected prevFocused: any;
    /**
     * Current animated elements count
     * @type {Number}
     */
    protected animated: number;
    constructor(props: Props, context: any);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    componentDidUpdate(prevProps: Props, prevState: any): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    /**
     * Changes current stage
     *
     * @param  {mixed} stage
     * @return {void}
     */
    protected changeStage(stage: any): void;
    /**
     * Handles opening stage
     *
     * @return {void}
     */
    protected onOpening(): void;
    /**
     * Handles opened stage
     *
     * @return {void}
     */
    protected onOpened(): void;
    /**
     * Handles mouse events
     *
     * @param  {MouseEvent} e
     * @return {void}
     */
    protected onClick: (e: any) => void;
    /**
     * Handles keyboard events
     *
     * @param  {KeyboardEvent} e
     * @return {void}
     */
    protected onKeydown: (e: any) => void;
    /**
     * Handles document clicks
     *
     * @param  {MouseEvent} e
     * @return {void}
     */
    protected onDocClick: (e: any) => void;
    /**
     * Cleans things up
     *
     * @return {void}
     */
    protected cleanup: () => void;
}
export interface Props extends React.HTMLAttributes<Modal> {
    show: boolean;
    id?: string;
    appendTo?: HTMLElement;
    noBackdrop?: boolean;
    noAutoFocus?: boolean;
    onCloseRequest?: () => any;
    onOpen?: () => any;
    onClose?: () => any;
    allowScroll?: boolean;
    withDocumentClicks?: boolean;
}
