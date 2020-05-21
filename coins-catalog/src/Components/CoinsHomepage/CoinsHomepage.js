import React from 'react';
import {Link} from 'react-router-dom';
import './CoinsHomepage.css';
import HomepageHeader from '../HomepageHeader';
import CoinsListItem from '../CoinsListItem';
import {
    RightOutlined
  } from '@ant-design/icons';

  import { Typography } from 'antd';
  const { Text } = Typography;

class CoinsHomepage extends React.Component{
    state={
        data:[],
        searchProps:{},
        filteredData:[],
        fields:[],
        inputValue:''
    }
    

    componentDidMount(){
        this.getData();
    }
    getData=()=>{
        fetch(`http://localhost:3002/coins/`)
        .then(res=>res.json())
        .then(data=>this.setState({
            data:data
        }))
    }

    inputChangeHandler=(e)=>{
        this.setState({inputValue:e.target.value})
    }

    advancedPropHandler=values=>{
        let search = {};
        let newFields = []
        for(let i =0;i < values.length;i++){
            if(values[i].value){ 
                search[values[i].name[1]]=values[i].value
            }
            newFields = [...newFields,
                {
                    name:  values[i].name,
                    value: values[i].value
                }
            ]
        }
        this.setState({
            searchProps:search,
            fields: newFields
        })
    }

    filterDataHandler=()=>{
        const requestBody = {inputValue:this.state.inputValue}
        fetch('http://localhost:3002/search', {
        method:'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-type': 'application/json' }
        })
        .then(res => res.json())
        .then((data) => {
            const seacrhKeys = Object.keys(this.state.searchProps)
            let newArray = data;
            
            for(let i = 0;i<seacrhKeys.length;i++){
                // console.log(seacrhKeys[i],this.state.searchProps[seacrhKeys[i]])
                if(seacrhKeys[i]==='priceFrom'){
                    newArray=newArray.filter(item=>{
                        return item.price > this.state.searchProps[seacrhKeys[i]]
                    })
                }else if(seacrhKeys[i]==='priceTo'){
                    newArray=newArray.filter(item=>{
                        return this.state.searchProps[seacrhKeys[i]] > item.price  
                    })
                }else if(seacrhKeys[i]==='yearTo'){
                    newArray=newArray.filter(item=>{
                        return this.state.searchProps[seacrhKeys[i]] > item.year  
                    })
                }else if(seacrhKeys[i]==='yearFrom'){
                    newArray=newArray.filter(item=>{
                        return item.year > this.state.searchProps[seacrhKeys[i]]  
                    })
                }else if(this.state.searchProps[seacrhKeys[i]] !== 'All'){
                    newArray = newArray.filter(item=>{
                        return item[seacrhKeys[i]] === this.state.searchProps[seacrhKeys[i]]
                    })
                }
            }
            this.setState({
                filteredData: newArray
            })
        });
    }

    backHandler=()=>{
        this.setState({filteredData:[]})
    }

    render(){
        // console.log(this.state.filteredData)
        return(
            <div id='home'>
                {this.state.filteredData.length===0 ?
                <div>
                    <h1>Homepage</h1>
                    <HomepageHeader 
                        inputChange={this.inputChangeHandler}
                        fields = {this.state.fields} 
                        advancedPropHandler={this.advancedPropHandler} 
                        onClick={this.filterDataHandler} data={this.state.data}/>
                    <div className='coins-homepage'>
                        <div className='slideRight'>
                            <h2>Bullion coins</h2>
                            <Link className='homepage-link' to={'/coins/bullion'}>Show All <RightOutlined /></Link>
                            <div className='img-coin-type'>
                                <img src={'/coinsImages/South_Vietnamese_Dong_1.png'} alt="coin"/>
                            </div>
                        </div>
                        <div className='slideRight'>
                            <h2>Exclusive coins</h2>
                            <Link className='homepage-link' to={'/coins/exclusive'}>Show All <RightOutlined /></Link>
                            <div className='img-coin-type'>
                                <img src={'/coinsImages/ISK_2.png'} alt="coin"/>
                            </div>
                        </div>
                        <div className='slideRight'>
                            <h2>Commemorative coins</h2>
                            <Link className='homepage-link' to={'/coins/commemorative'}>Show All <RightOutlined /></Link>
                            <div className='img-coin-type'>
                                <img src={'/coinsImages/Looney_1.png'} alt="coin"/>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <h1>Homepage</h1>
                    {/* <Link className='app-link-to-home' to={'/'}><span>Homepage</span>-List of the coins</Link> */}
                    <Text underline className='home-back' onClick={this.backHandler}>Back</Text>
                    <HomepageHeader
                    inputChange={this.inputChangeHandler}
                    fields = {this.state.fields} 
                    advancedPropHandler={this.advancedPropHandler} 
                    onClick={this.filterDataHandler} data={this.state.data}/>
                    <div className='coins-list'>
                        {this.state.filteredData.map(item=>(
                            <CoinsListItem key={item.ID} data={item}/>
                        ))}
                    </div>
                </div>}
            </div>
        );
    }
}

export default CoinsHomepage;