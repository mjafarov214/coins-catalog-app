import React from 'react';
import './CoinsList.css';
import CoinsListItem from '../CoinsListItem';
import HomepageHeader from '../HomepageHeader';
import {Link} from 'react-router-dom';
import { Empty,Pagination } from 'antd';

class CoinsList extends React.Component{
    state={
        data:[],
        searchProps:{},
        filteredData:[],
        fields:[],
        inputValue:'',
        current: 1,
        pageSize: 6,
        lastPage:null
    }
    componentDidMount(){
        this.getData();
    }
    getData=()=>{
        fetch(`http://localhost:3002/coins/${this.props.typeCoin}`)
        .then(res=>res.json())
        .then(data=>this.setState({
            data:data,
            filteredData:data,
            lastPage: +Math.ceil(data.length / this.state.pageSize)
        }))
    }

    onChangePagination = page => {
        this.setState({
            current: page,
        });
    };

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
        fetch(`http://localhost:3002/search/${this.props.typeCoin}`, {
        method:'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-type': 'application/json' }
        })
        .then(res => res.json())
        .then((data) => {
            // console.log(data);
            const seacrhKeys = Object.keys(this.state.searchProps)
            let newArray = data
    
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
                filteredData: newArray,
                lastPage: +Math.ceil(newArray.length / this.state.pageSize)
            });
        }).catch(()=>{
            this.setState({
                filteredData: [],
                lastPage: 0
            });
        }) 

    }

    render(){
        // console.log(this.state.filteredData)
        const{current,pageSize,lastPage} = this.state
        return(
            <div>
                <h1>List of the coins</h1>
                <Link className='app-link-to-home' to={'/'}><span>Homepage</span>-List of the coins</Link>
                <HomepageHeader 
                    inputChange={this.inputChangeHandler}
                    fields = {this.state.fields} 
                    advancedPropHandler={this.advancedPropHandler} 
                    onClick={this.filterDataHandler} data={this.state.data}/>
                <div className='coins-list'>
                    {this.state.filteredData.length===0?<div className='empty'><Empty/></div>:
                        this.state.filteredData
                        .slice(pageSize * (current - 1), pageSize * current)
                        .map(item=>(
                            <CoinsListItem key={item.ID} data={item}/>
                        ))}
                </div>
                <div className='admin-pagination'>
                    <Pagination current={this.state.current} 
                        onChange={this.onChangePagination} 
                        defaultPageSize={pageSize}
                        total={+lastPage*6} />
                </div>
            </div>
        );
    }
}

export default CoinsList;