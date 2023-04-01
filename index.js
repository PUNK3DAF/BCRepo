import React from "react";
import AppViews from ".views/AppViews";
import DeployerView from ".views/DeployerViews";
import AttacherView from ".views/AttacherViews";
import { renderDOM, renderView } from ".views/render";
import "./index.css";
import * as backend from "./build/index.main.mjs";

const handToInt = { ROCK: 0, PAPER: 1, SCISSORS: 2 };
const intToOutcome = ["Bob wins!", "Draw", "Alice wins!"];

const defaults = { defaultFundAmt: "10", defaultWager: "3" };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { view: "ConnectAccount", ...defaults };
  }

  async componentDidMount() {
    this.setState({ view: "DeployerOrAttacher" });
  }

  selectDeployer() {
    this.setState({ view: "Wrapper", ContentView: Deployer });
  }

  selectAttacher() {
    this.setState({ view: "Wrapper", ContentView: Attacher });
  }

  render() {
    return renderView(this, AppViews);
  }
}

class Player extends React.Component {
  async getHand() {
    const hand = await new Promise((resolveHandP) => {
      this.setState({ view: "GetHand", playable: true, resolveHandP });
    });
    this.setState({ view: "WaitingForResult", hand });
    return handToInt[hand];
  }

  seeOutcome(i) {
    this.setState({ view: "Done", outcome: intToOutcome[i] });
  }

  informTimeout() {
    this.setState({ view: "Timeout" });
  }
  playerHand(hand) {
    this.state.resolveHandP(hand);
  }
}

class Attacher extends Player {
  constructor(props) {
    super(props);
    this.state = { view: "Attach" };
  }

  attach(ctcInfoStr) {
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({ view: "Attaching" });
    backend.Bob(ctc, this);
  }

  async acceptWager(wagerAtomic) {
    const wager = reach.formatCurrency(wagerAtomic, 4);
    return await new Promise((resolveacceptedP) => {
      this.setState({ view: "AcceptTerms", wager, resolveacceptedP });
    });
  }

  termsAccepted() {
    this.state.resolveacceptedP();
    this.setState({ view: "WaitingForTheTurn" });
  }

  return() {
    return renderView(this, AttacherView);
  }
}

class Deployer extends Player {
  constructor(props) {
    super(props);
    this.state = { view: "SetWager" };
  }

  setWager(wager) {
    this.setState({ view: "Deploy", wager });
  }

  async deploy() {
    const ctc = this.props.acc.contract(backend);
    this.setState({ view: "deploying", ctc });
    this.wager = reach.parseCurrency(this.state.wager);
    this.deadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector];
    backend.Alice(ctc, this);
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    this.setState({ view: "WaitingForAttacher", ctcInfoStr });
  }

  render() {
    return renderView(this, DeployerView);
  }
}

renderDOM(<App />);
