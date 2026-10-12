import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback-view" role="alert">
          <div className="error-fallback-card">
            <div className="error-badge">Application Error</div>
            <h2>Something unexpected occurred</h2>
            <p className="error-msg">
              {this.state.error?.message || "An error prevented the interface from loading."}
            </p>
            <button
              type="button"
              className="error-action-btn"
              onClick={this.handleReset}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
