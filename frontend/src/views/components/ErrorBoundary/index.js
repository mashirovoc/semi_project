import React, { Component } from 'react';
class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return <h1>An unexpected error occurred.</h1>;
        }
        return this.props.children;
    }
}
export default ErrorBoundary;