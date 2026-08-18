import { Component } from 'react';
import Button from '../ui/Button.jsx';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-[50vh] place-items-center p-8 text-center">
          <div>
            <h1 className="text-xl font-semibold">We hit a small roadblock.</h1>
            <p className="mt-2 text-sm text-ink-mute">YatraGenie couldn't render this screen.</p>
            <Button className="mt-6" onClick={() => this.setState({ error: null })}>
              Try Again
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
