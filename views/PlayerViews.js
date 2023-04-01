import React from "react";

const exports = {};

exports.GetHand = class extends React.Component {
  render() {
    const { parent, playable, hand } = this.props;
    return (
      <div>
        {" "}
        {hand ? "It was a draw! Pick again." : ""}
        <br />
        {!playable ? "Please wait" : ""}
        <br />
        <button disabled={!playable} onClick={() => parent.playHand("ROCK")}>
          ROCK
        </button>
        <button disabled={!playable} onClick={() => parent.playHand("PAPER")}>
          PAPER
        </button>
        <button
          disabled={!playable}
          onClick={() => parent.playHand("SCISSORS")}
        >
          SCISSORS
        </button>
      </div>
    );
  }
};

exports.WaitingForResult = class extends React.Component {
  render() {
    return <div>Waiting for results...</div>;
  }
};

exports.Done = class extends React.Component {
  render() {
    const { outcome } = this.props;
    return (
      <div>
        Thank you for playing. The outcome of the game was:
        <br />
        {outcome || "Unknown"}
      </div>
    );
  }
};

exports.Timeout = class extends React.Component {
  render() {
    return <div>There's been a timeout. Something took too long</div>;
  }
};

export default exports;
