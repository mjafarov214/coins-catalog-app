import React from 'react';
import 'antd/dist/antd.css';
import './HomepageHeader.css';
import AdvancedFilter from '../AdvancedFilter';
import {Link} from 'react-router-dom';
import {
    DownOutlined,
    UpOutlined
  } from '@ant-design/icons';
import { Input,Button,Typography } from 'antd';

const { Text } = Typography;

class HomepageHeader extends React.Component{
    state={
        advancedVisible: false,
    }
    advancedVisHandler=()=>{
        this.setState({advancedVisible: !this.state.advancedVisible})
    }

    searchButtonHandler=()=>{
        this.props.onClick();
        this.setState({advancedVisible:false});
    }
    
    render(){
        return(
            <div>
                <div className='coin-filter'>
                    <Link className='filter-link-to-admin' to={'/login'}>Admin panel</Link>
                    <p>Input field</p>
                    <div className='search-area'>
                        <Input className='search-input' onChange={this.props.inputChange} placeholder='Search'/>
                        <Button className='search-button' onClick={this.searchButtonHandler} type="primary">Search</Button>
                    </div>
                    <div onClick={this.advancedVisHandler} className='advanced-ind'>
                        <Text underline>Advanced filter</Text>
                        <div className='filter-icon-area'>
                            {!this.state.advancedVisible?
                            <DownOutlined className='filter-icon'/>
                            :<UpOutlined className='filter-icon up-filter-icon' />}
                        </div>
                    </div>
                </div>
                <div className='advanced-area'>
                    {this.state.advancedVisible?
                    <AdvancedFilter fields={this.props.fields} 
                        onChange={this.props.advancedPropHandler} 
                        data={this.props.data}/>
                    :null}
                </div>
            </div>
        );
    }
}

export default HomepageHeader;