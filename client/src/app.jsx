import React, {Component} from 'react';
import graph, {getMic, getFreq} from '../models/micGraph';
import OurButton from './components/Button.jsx'; 
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import {Row,Grid,Col,Button} from 'react-bootstrap';
        
constructor() {
    super();
    this.state ={
      scream: false,
      text: 'Start',
      mic: null,
      page: 'scream',
      screamLevel: 0,
      freqArray: [0,0,0],
      displayScore: false
    };
    this.toggleClick = this.toggleClick.bind(this);
    this.micHandler = this.micHandler.bind(this);
    this.navClickHandler = this.navClickHandler.bind(this);
    setTimeout(this.micHandler,250);
  }

  micHandler() {
    this.setState({mic:getMic()});
    var freq = getFreq();
    this.state.freqArray[0] += freq[0]; 
    this.state.freqArray[1] += freq[1]; 
    this.state.freqArray[2] += freq[2]; 
    var micLevel = this.state.mic.getLevel();
    if(micLevel > this.state.screamLevel) {
      this.setState({screamLevel: micLevel});
    }
    //console.log(micLevel); // for debugging 
    if	(this.state.scream) {
      //console.log(micLevel); // for debugging 
      if (micLevel < 0.15) {
	      this.setState({scream: false});
      } 
    } else if (micLevel > 0.15) {
      this.setState({scream: true})
    }
    if(this.state.text === 'Stop') {
      setTimeout(this.micHandler, 250);
    }
  }

  saveScream() {
    axios.post('/addScream', {
      params: {
	      volume: this.state.screamLevel,
	      user: this.state.user,
	      lowFreq: this.state.freqArray[0],
	      midFreq: this.state.freqArray[1],
	      highFreq: this.state.freqArray[2]
        }
      }).then((res) => {
        this.setState({freqArary: [0,0,0]});
      })
    }

  toggleClick(e) {
    e.preventDefault();
    //if button text is 'Start' or 'Scream Again'
    if (this.state.text === 'Start' || this.state.text === 'Scream Again') {
      //set button text to 'Stop'
      this.setState({text: 'Stop'});
      this.setState({displayScore: false});
      this.state.mic.start();
      setTimeout(this.micHandler,100);
      //else if button text is 'Stop'
    } else if (this.state.text === 'Stop') {
      //set button text to 'Scream Again'
      this.setState({text: 'Scream Again'});
      //display highest volume
      this.setState({displayScore: true})
      this.state.mic.stop(); 
    }
  }
	navClickHandler(eventKey) {
		//console.log('test', eventKey);
		if (eventKey === 'logout') {
		// should logout somehow (MAGIC, obviously)
		} else if (eventKey === 'login') {
		//should login or signup user
		} else if (eventKey === 'profile') {
			this.setState({page: 'profile'});
		}
	}    

	render() {
		return (
			<Grid>
				<Row> supBitches </Row>
				<Row><Login /></Row>
				<Row>
					<NavBar func={this.navClickHandler} />
				</Row>
					{this.state.page === 'scream' ? 
					<div>
						<Row className="gif" >
							<Col md={3}>
								{this.state.displayScore ?
								<div>
									<Row>Score: {Math.floor(this.state.screamLevel * 1000)} </Row>  
									<Row><Button onClick={this.saveScream} > Save Scream? </Button> </Row> 
								</div> : <div> </div> } 
							</Col>
							<Col md={6}>	
								{this.state.scream ? <img src="../models/cat.gif" alt="dancing cat" /> : <div> Scream </div>}
							</Col>	
				</Row>
				<Row>
					<Col md={2} mdOffset={5}> 
						<OurButton func={this.toggleClick} state={this.state.text}/>
					</Col>
				</Row> 
				<Row>
					<Col md={8} mdOffset={2} id='ScreamMeter'> </Col>
				</Row>
				</div> :
				<Profile />}
			</Grid> );
	}
}
export default App;

