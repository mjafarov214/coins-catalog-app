import React from 'react';
import CoinForm from '../CoinForm';
import{Redirect} from 'react-router-dom';
import 'antd/dist/antd.css';
import { notification,message} from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';

class CoinAdd extends React.Component{

    state={
        redirect: false
    }

    openNotification = () => {
        notification.open({
            message: `Your coin successfully added`,
            icon: <FileDoneOutlined style={{ color: '#108ee9' }} />,
        });
    };

    onFinish = values => {
        const token = this.props.token;
        const requestBody = {...values.coinAdd,token:token}
        // console.log(values);
        fetch('http://localhost:3002/coin/add', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-type': 'application/json' }
        })
        .then(res => res.json())
        .then((data) => {
        this.setState({redirect: true})
        this.openNotification()
        })
        .catch((err)=>{
            message.error('Please login!');
            }
        );
    };

    render(){
        if (this.state.redirect) {
            return <Redirect to='/admin'/>;
          }

        return(
            <div>
                <h1>Admin panel</h1>
                <CoinForm onFinish={this.onFinish}/>
            </div>
        );
    }
}

export default CoinAdd;