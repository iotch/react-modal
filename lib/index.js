"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var react_1 = require("react");
var react_portal_1 = require("@iotch/react-portal");
var react_animation_aware_1 = require("@iotch/react-animation-aware");
var DOCUMENT = document;
var HTML = DOCUMENT.documentElement;
var OPENING = 'OPENING';
var OPENED = 'OPENED';
var CLOSING = 'CLOSING';
var CLOSED = 'CLOSED';
/**
 * Parent element styles cache
 * @type {String}
 */
var parentStyleCache;
/**
 * Html element styles cache
 * @type {String}
 */
var htmlStyleCache;
/**
 * Current active modals ids
 * @type {Array}
 */
var nextId = 0;
var activeIds = [];
/**
 * Modal window component
 */
var Modal = (function (_super) {
    tslib_1.__extends(Modal, _super);
    function Modal(props, context) {
        var _this = _super.call(this, props, context) || this;
        /**
         * Current animated elements count
         * @type {Number}
         */
        _this.animated = 0;
        /**
         * Handles mouse events
         *
         * @param  {MouseEvent} e
         * @return {void}
         */
        _this.onClick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.props.onCloseRequest();
        };
        /**
         * Handles keyboard events
         *
         * @param  {KeyboardEvent} e
         * @return {void}
         */
        _this.onKeydown = function (e) {
            // escape key and current modal is on top
            if (e.keyCode === 27 && activeIds.lastIndexOf(_this.id) === activeIds.length - 1) {
                e.preventDefault();
                _this.props.onCloseRequest();
            }
        };
        /**
         * Handles document clicks
         *
         * @param  {MouseEvent} e
         * @return {void}
         */
        _this.onDocClick = function (e) {
            var props = _this.props;
            if (props.withDocumentClicks) {
                var target = e.target;
                var element = _this.element;
                if (target !== element && !element.contains(target)) {
                    _this.props.onCloseRequest();
                }
            }
        };
        /**
         * Cleans things up
         *
         * @return {void}
         */
        _this.cleanup = function () {
            var _a = _this.props, appendTo = _a.appendTo, onClose = _a.onClose;
            var prevFocused = _this.prevFocused;
            // remove from active modals
            activeIds.splice(activeIds.indexOf(_this.id), 1);
            // remove listeners
            DOCUMENT.removeEventListener('keydown', _this.onKeydown);
            DOCUMENT.removeEventListener('click', _this.onDocClick);
            // restore styles
            if (activeIds.length === 0) {
                if (parentStyleCache != null) {
                    appendTo.style.cssText = parentStyleCache;
                }
                if (htmlStyleCache != null) {
                    HTML.style.cssText = htmlStyleCache;
                }
            }
            // restore focus
            if (prevFocused && typeof prevFocused.focus === 'function') {
                prevFocused.focus();
            }
            // close callback
            onClose && onClose();
        };
        _this.state = {
            stage: CLOSED,
        };
        // obtain new id
        _this.id = props.id || ++nextId;
        return _this;
    }
    Modal.prototype.componentDidMount = function () {
        if (this.props.show) {
            this.changeStage(OPENING);
        }
    };
    Modal.prototype.componentWillReceiveProps = function (nextProps) {
        this.changeStage(nextProps.show ? OPENING : CLOSING);
    };
    Modal.prototype.componentDidUpdate = function (prevProps, prevState) {
        var that = this;
        var stage = that.state.stage;
        if (stage === prevState.stage) {
            return;
        }
        if (stage === OPENING) {
            that.onOpening();
        }
        else if (stage === OPENED) {
            that.onOpened();
        }
        else if (stage === CLOSED) {
            that.cleanup();
        }
    };
    Modal.prototype.componentWillUnmount = function () {
        var that = this;
        var currentStatge = that.state.stage;
        if (currentStatge !== CLOSED) {
            that.cleanup();
        }
    };
    Modal.prototype.render = function () {
        var that = this;
        var props = that.props;
        var className = props.className || 'modal';
        var state = that.state.stage;
        var backdrop;
        if (state === CLOSED) {
            return null;
        }
        var animationAwareProps = {
            show: state !== CLOSING,
            onCompleted: that.changeStage.bind(that, CLOSED),
            onEntered: that.changeStage.bind(that, OPENED),
            animateAppear: true,
        };
        if (!props.noBackdrop) {
            backdrop = React.createElement(react_animation_aware_1.default, tslib_1.__assign({}, animationAwareProps),
                React.createElement("span", { className: "backdrop", onClick: that.onClick }));
        }
        return React.createElement(react_portal_1.default, { to: props.appendTo },
            React.createElement("div", { className: className, tabIndex: -1, ref: function (el) { return el && (that.element = el); } },
                React.createElement(react_animation_aware_1.default, tslib_1.__assign({}, animationAwareProps),
                    React.createElement("div", { className: "body" }, props.children)),
                backdrop));
    };
    /**
     * Changes current stage
     *
     * @param  {mixed} stage
     * @return {void}
     */
    Modal.prototype.changeStage = function (stage) {
        var that = this;
        var prevStage = that.state.stage;
        if (prevStage === stage) {
            return;
        }
        if (!stage
            || prevStage === CLOSED && stage === CLOSING
            || prevStage === OPENED && stage === OPENING) {
            return;
        }
        if (stage === CLOSED || stage === OPENED) {
            // decrease animated count and
            // stop if has pending animations
            that.animated--;
            if (that.animated > 0) {
                return;
            }
        }
        else {
            // keep actual registered animations count
            that.animated = that.props.noBackdrop ? 1 : 2;
        }
        that.setState({ stage: stage });
    };
    /**
     * Handles opening stage
     *
     * @return {void}
     */
    Modal.prototype.onOpening = function () {
        var that = this;
        var _a = that.props, allowScroll = _a.allowScroll, appendTo = _a.appendTo;
        // listen to keyboard events
        DOCUMENT.addEventListener('keydown', that.onKeydown);
        // listen to document clicks
        DOCUMENT.addEventListener('click', that.onDocClick);
        // add to active modals
        activeIds.push(that.id);
        // if first active modal
        if (!allowScroll && activeIds.length === 1) {
            parentStyleCache = disableElementScoll(appendTo);
            htmlStyleCache = disableElementScoll(HTML);
        }
    };
    /**
     * Handles opened stage
     *
     * @return {void}
     */
    Modal.prototype.onOpened = function () {
        var that = this;
        var _a = that.props, onOpen = _a.onOpen, noAutoFocus = _a.noAutoFocus;
        if (!noAutoFocus) {
            // store prev focused element
            that.prevFocused = DOCUMENT.activeElement;
            // focus element
            that.element.focus();
        }
        // open callback
        onOpen && onOpen();
    };
    /**
     * Default props
     * @type {Props}
     */
    Modal.defaultProps = {
        show: false,
        appendTo: DOCUMENT.body,
        onCloseRequest: function () { }
    };
    return Modal;
}(react_1.Component));
exports.default = Modal;
/**
 * Disables element scrolling
 *
 * @param  {HTMLElement} element
 * @return {String}      previous style string
 */
function disableElementScoll(element) {
    var style = element.style;
    var prevStyleText = style.cssText;
    var computed = window.getComputedStyle(element);
    var yOverflowed = element.clientHeight < element.scrollHeight;
    var xOverflowed = element.clientWidth < element.scrollWidth;
    var scrollBarWidth = scrollbarWidth();
    var paddingRight = 'paddingRight';
    var paddingBottom = 'paddingBottom';
    var parse = parseFloat;
    var px = 'px';
    if (yOverflowed || xOverflowed) {
        style['overflow' + (yOverflowed ? 'Y' : xOverflowed ? 'X' : '')] = 'hidden';
    }
    if (yOverflowed) {
        style[paddingRight] = (parse(computed[paddingRight]) || 0) + scrollBarWidth + px;
    }
    if (xOverflowed) {
        style[paddingBottom] = (parse(computed[paddingBottom]) || 0) + scrollBarWidth + px;
    }
    return prevStyleText;
}
/**
 * Gets browser scrollbar width
 *
 * @return {number}
 */
function scrollbarWidth() {
    var width = 0;
    var body = DOCUMENT.body;
    var scrollDiv = DOCUMENT.createElement('div');
    scrollDiv.style.position = 'fixed';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';
    body.appendChild(scrollDiv);
    width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    body.removeChild(scrollDiv);
    return width;
}
