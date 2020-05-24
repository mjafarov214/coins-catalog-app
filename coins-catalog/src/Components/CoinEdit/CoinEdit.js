import React from 'react';
import CoinForm from '../CoinForm';
import{Redirect} from 'react-router-dom';
import { notification,message} from 'antd';
import { FileSyncOutlined } from '@ant-design/icons';

class CoinEdit extends React.Component{
    state={
        redirect: false,
        editedItemID:null,
        token: localStorage.getItem('token'),
        fields:[]
    }
    componentDidMount(){
        this.getData();
    }
    getData=()=>{
        fetch(`http://localhost:3002/coin/${this.props.match.params.ID}`)
        .then(res=>res.json())
        .then(data=>{
            // console.log(data)
            this.setState({
                editedItemID:data[0].ID,
                fields:[
                    {
                      name: ['coinAdd', 'name'],
                      value: data[0].name
                    },
                    {
                        name: ['coinAdd', 'firstPar'],
                        value: data[0].firstPar
                    },
                    {
                        name: ['coinAdd', 'price'],
                        value: data[0].price
                    },
                    {
                        name: ['coinAdd', 'image_src'],
                        value: data[0].image_src
                    },
                    {
                        name: ['coinAdd', 'face_value'],
                        value: data[0].face_value
                    },
                    {
                    name: ['coinAdd', 'image_src_rever'],
                    value: data[0].image_src_rever
                    },
                    {
                    name: ['coinAdd', 'year'],
                    value: data[0].year
                    },
                    {
                    name: ['coinAdd', 'secondPar'],
                    value: data[0].secondPar
                    },
                    {
                    name: ['coinAdd', 'typeCoin'],
                    value: data[0].typeCoin
                    },
                    {
                    name: ['coinAdd', 'country'],
                    value: data[0].country
                    },
                    {
                    name: ['coinAdd', 'quality'],
                    value: data[0].quality
                    },
                    {
                    name: ['coinAdd', 'metal'],
                    value: data[0].metal
                    },
                    {
                    name: ['coinAdd', 'weight'],
                    value: data[0].weight
                    },

                ]
            })
        })
    };

    openNotification = () => {
        notification.open({
            message: `Successfully edited`,
            icon: <FileSyncOutlined style={{ color: '#108ee9' }} />,
        });
    };

    onFinish = values => {
        const requestBody = {...values.coinAdd,token:this.state.token}
        // console.log(values);
        fetch(`http://localhost:3002/coin/edit/${this.state.editedItemID}`, {
        method: 'PUT',
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
        console.log(this.props)
        // console.log(this.state.editedItemID);
        if (this.state.redirect) {
            return <Redirect to='/admin'/>;
          }
        return(
            <div>
                <h1>Admin panel</h1>
                <CoinForm fields={this.state.fields} onFinish={this.onFinish}/>
            </div>
        );
    }
}

export default CoinEdit