import React, { Component } from 'react';
import {Statistic, Divider, Grid, Table, Message, Rating, Icon, Button,
         Menu, Container, Segment, Header} from 'semantic-ui-react';
import { ethers } from 'ethers';
import factory from '../ethereum/factory';
import Survey from '../ethereum/survey';
import Layout from '../components/Layout';
import { Router } from '../routes';
import moment from 'moment';
import web3 from '../ethereum/web3';
import {search} from '../utils/search';
import { Chart } from "react-google-charts";

class SurveyIndex extends Component {
    state = {
        currentIndex: 0,
        activeEventField: 'Technology',
        availableSurveys: [],
        guestSpeaker: [], 
        suggestion: [], 
        time: [], 
        surveyRating: [],  
        topics: {},
        chartData: []
    }

    static async getInitialProps({ req, query }) { 
        
        let deployedSurveys = await factory.methods.getDeployedSurveys().call();
        deployedSurveys.reverse();

        let deployedCat1 = [];
        let deployedCat2 = [];
        let deployedCat3 = [];
        let deployedCat4 = [];
        let searchItem;
        //filter the questions based on search value
        if (query.value != undefined && query.value != 'favicon.ico') {
            searchItem = decodeURIComponent(query.value.substring(7));
            deployedSurveys = await search(searchItem,deployedSurveys);
        }
        
        await Promise.all(
            deployedSurveys.map(async (item) => {
                const itemCat = await Survey(item).methods.getEventField().call();
                console.log(itemCat);
                switch (itemCat) {
                    case "Technology":   {
                        deployedCat1.push(item);
                        break;
                    }   
                    case "Art": {
                        deployedCat2.push(item);
                        break;
                    }   
                    case "Business":  {
                        deployedCat3.push(item);
                        break;
                    }   
                    case "Politic":  {
                        deployedCat4.push(item);
                        break;
                    } 
                }

            }))
        return {deployedCat1, deployedCat2, deployedCat3, deployedCat4, searchItem};
    }

    componentDidMount = async () => {
        
        await this.renderData("Technology");
    }

    componentDidUpdate = async (prevProps) =>{
        if (prevProps.searchItem != this.props.searchItem){
        await this.renderData(this.state.activeEventField);
        }
    }

    renderData = async (category) => {

        const {deployedCat1, deployedCat2, deployedCat3, deployedCat4} = this.props;

        let combinedSuggestion = "";
        let availableSurveys = [];

        switch (category) { 
            case "Technology": {
                availableSurveys = deployedCat1;
                break;
            }   
            case "Art": {
                availableSurveys = deployedCat2;
                break;
            }   
            case "Business": {
                availableSurveys = deployedCat3;
                break;
            }  
            case "Politic": {
                availableSurveys = deployedCat4;
                break;
            } 
        }

        let guestSpeaker = [];
        let suggestion = [];


        const summary = await Promise.all(
            availableSurveys
                .map((address) => {
                    return Survey(address).methods.getSummary().call();
                })  
        );

        summary.forEach(function(item){
            guestSpeaker.push(item[7]);
            suggestion.push(item[8]);
            combinedSuggestion += item[8];
        });



        const timeArray = await Promise.all(
            availableSurveys.map((address)=>{
                return Survey(address).methods.getTime().call();
            })
        );
        
        const timeStart = timeArray.map((time)=>
            {return moment.unix(parseInt(time)).format('dddd, Do MMMM YYYY, h:mm:ss a')});


        const surveyRating = await Promise.all(
            availableSurveys.map((address) => {
                return Survey(address).methods.getRatingSurvey().call();
            })
        );

        this.topicTagging(combinedSuggestion);

        this.setState({
            availableSurveys: availableSurveys,
            guestSpeaker: guestSpeaker, 
            suggestion: suggestion, 
            timeStart: timeStart, 
            surveyRating: surveyRating
        });
    }

    showGalaxy() {
        return (
            <Segment 
                inverted
                style={{ height: 580, padding: '1em 0em', width: '1450px', 
                        marginLeft: '-180px', marginTop: '-40px',
                        backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/499416/demo-bg.jpg")'}}
            >
                <div style={{width: '1600px'}}>
                    <div className="container demo" style={{width: '100%'}}>
                        <div className="content" style={{width: '100%'}}>
                            <div id="large-header" className="large-header"
                                style={{position: 'relative', width: '100%', 
                                        height: 700, overflow: 'hidden', backgroundSize: 'cover',
                                        backgroundPosition: 'center center', zIndex: 1}}
                            >
                                <canvas id="demo-canvas" />
                                <h1 className="main-title"
                                    style={{position: 'absolute', margin: 0, 
                                            color: '#F9F1E9', 
                                            textAlign: 'left',
                                            top: '50%', left: '50%',  
                                            WebkitTransform: 'translate3d(-68%, -230%, 0)',
                                            transform: 'translate3d(-68%, -230%, 0)', 
                                            fontSize: '3.5em', 
                                            letterSpacing: '0.1em',
                                            fontWeight: 200, 
                                            width: 800
                                        }}
                                >
                                        Blockchain-based
                                        <br />
                                        Smart Surveys for NTU events
                                        
                                    </h1>

                                <h1 className="main-title"
                                    style={{position: 'absolute', margin: 0, 
                                            color: '#F9F1E9', 
                                            textAlign: 'left',
                                            top: '50%', left: '50%', 
                                            WebkitTransform: 'translate3d(-65%, -30%, 0)',
                                            transform: 'translate3d(-65%, -30%, 0)',
                                            fontSize: '1.5em', 
                                            letterSpacing: '0.1em',
                                            fontWeight: 200, 
                                            width: 800,
                                            lineHeight: "35px"
                                        }}
                                >
                                        Let us know which events you expect through surveys
                                        <br />
                                        Rate your friends' suggestions
                                        <br />
                                        Find out more ...
                                        <br />
                                        <Icon name='angle double down' color='red' size='big' style={{marginLeft: "50px", marginTop: "15px"}}/>
                                        <br />
                                        <Icon name='angle double down' color='red' size='big' style={{marginLeft: "50px"}}/>
                                    </h1>
                            </div>
                        </div>
                    </div>
                    <script src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/499416/demo.js'></script>
                </div>
            </Segment> 
        )
    }

    topicTagging = async (combinedSuggestion) => {
        combinedSuggestion = encodeURIComponent(combinedSuggestion.trim()) //replace space by %20
        var colors = ["#13115c", "#100d75", "#060380", "#0c0991", "#110da6",
                      "#120dba", "#221dd1", "#2c27e3", "#332ef0", "#6662fc"]

        var data = null;
        var topics;
        var xhr = new XMLHttpRequest();
        
        xhr.withCredentials = true;
    
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                var res = JSON.parse(this.response);
                topics = res["topic"];
                console.log(topics);
            }
        });

        xhr.open("GET", "https://twinword-topic-tagging.p.rapidapi.com/generate/?text=" + combinedSuggestion);
        xhr.setRequestHeader("x-rapidapi-host", "twinword-topic-tagging.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", "7a151ca22amshb04a57bd255536cp1b8b2djsn7f7a6182bdef");

        xhr.send(data);
        
        
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));  //Wait 2s then continue
        
        this.setState({topics: topics});

        console.log("this.state.topics: ", this.state.topics);


        var chartData = [
            ['Topics', 'Proportion']
        ];

        
        var i;
        if (topics != null) {
            var keys = Object.keys(topics);
            
            for (i = 0 ; i < keys.length ; i++) {
                var pair = [];
                pair.push(keys[i]);
                pair.push(topics[keys[i]]);
                chartData.push(pair);
            }
        }

        this.setState({chartData: chartData});
        console.log("this.state.chartData", this.state.chartData);
        
    }


    handleEventFieldClick = async (e, { name }) => {
        await this.setState({ 
            activeEventField: name
        });
        const {activeEventField} = this.state;
        this.renderData(activeEventField);
    }

    renderRentsDesktop() {
        const {activeEventField} = this.state;

        const items = this.state.availableSurveys.map((address, i) => {
        const rating = this.state.surveyRating[i];
        const timeStart = this.state.timeStart[i];
        const guestSpeaker = this.state.guestSpeaker[i];
        const suggestion = this.state.suggestion[i];

            return <Table.Row key={i} style={{cursor:'pointer'}} onClick={() => Router.pushRoute(`/surveys/${address}`)}>
                <Table.Cell textAlign='center' width={2}>
                    <Statistic size='mini' color='red'>
                        <Statistic.Value><span 
                                            style={{fontSize: 15, color: '#6A737C'}}><Rating icon='star' size='huge' 
                                            rating={rating}
                                            maxRating={5} disabled />
                                        </span></Statistic.Value>
                        <Statistic.Label><span style={{fontSize: 15, color: '#6A737C'}}>votes</span></Statistic.Label>
                    </Statistic>
                </Table.Cell>
                <Table.Cell textAlign='center' width={2}>
                    <Message compact size='mini'
                            header={'Guest Speaker: '+guestSpeaker}
                        />
                </Table.Cell>
                <Table.Cell textAlign='center'>
                    <p>{suggestion}</p>
                </Table.Cell> 
                <Table.Cell textAlign='center'>
                    <Message compact size='mini'
                            header={'Time published: '+timeStart}
                        />
                </Table.Cell> 
            </Table.Row>
        });

        return ( 
            <Container>
                <Divider horizontal 
                style={{marginTop: '70px'}} 
                >
                    <Header as='h2'>
                        <Icon name='tag' color='red'/>
                        STATISTICS
                    </Header>
                </Divider>

                {this.state.chartData.length > 1 ?
                    <center>
                        <div
                            style={{
                                borderRadius: '10px', 
                                width:"900px", height:"400px",
                                padding: '5px', lineHeight: 0, 
                                
                                backgroundImage: 'url("https://cdn.pixabay.com/photo/2015/12/01/15/39/christmas-1072359__340.jpg")'
                            }}
                        >
                            <Chart
                                width={'890px'}
                                height={'390px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={this.state.chartData}
                                options={{
                                    // Material design options
                                    chart: {
                                    title: 'TRENDING TOPICS',
                                    //subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                                    },
                                }}
                                // For tests
                                rootProps={{ 'data-testid': '2' }}
                            />
                        
                        </div>
                    </center>
                : null}

                <Divider hidden />

                <h2>Suggestions</h2>

                <Divider hidden/>

                <Menu tabular color={'green'}>
                    <Menu.Item name='Technology' active={activeEventField === 'Technology'} 
                                style={{fontSize:"18px"}}
                                onClick={this.handleEventFieldClick} />
                    <Menu.Item name='Art' active={activeEventField === 'Art'} 
                                style={{fontSize:"18px"}}
                                onClick={this.handleEventFieldClick} />
                    <Menu.Item name='Business' active={activeEventField === 'Business'} 
                                style={{fontSize:"18px"}}
                                onClick={this.handleEventFieldClick} />
                    <Menu.Item name='Politic' active={activeEventField === 'Politic'} 
                                style={{fontSize:"18px"}}
                                onClick={this.handleEventFieldClick} />
                </Menu>
                <Table>
                    <Table.Body>
                        {items}
                    </Table.Body>
                </Table>
            </Container>
        )
    }


    render() {
        const itemsLength = this.state.availableSurveys? this.state.availableSurveys.length : 0;

        return(
            <Layout searchItem = {this.props.searchItem} >
                {this.showGalaxy()}
            
                {/* <Divider horizontal 
                style={{marginTop: '70px'}} 
                >
                    <Header as='h2'>
                        <Icon name='tag' color='red'/>
                        STATISTICS
                    </Header>
                </Divider> */}

                {/* <h2>Suggestions</h2>
                <Divider hidden/> */}

                {this.renderRentsDesktop()}

                <Divider hidden/>
                <div style={{ marginTop: 20 }}>Found {itemsLength} Item(s).</div>
                <Divider hidden/>
            </Layout>
        );
    }
}

export default SurveyIndex;
