import React from 'react';
import CoinsListItem from '../CoinsListItem';
import './AdminPanelHome.css';
import 'antd/dist/antd.css';
import { Modal, Button,Input,Pagination,notification,message } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import {Link,Redirect} from 'react-router-dom';


class AdminPanelHome extends React.Component{
    state={
        data:[],
        current: 1,
        pageSize: 4,
        visible: false,
        inputValue:'',
        lastPage:'',
        filteredData:[],
        redirect: false,
        deleteItemID:null
    }
    componentDidMount(){
        this.getData();
    }

    getData=()=>{
        fetch(`http://localhost:3002/coins`)
        .then(res=>res.json())
        .then(data=>this.setState({
            data:data,
            filteredData:data,
            lastPage: +Math.ceil(data.length / this.state.pageSize)
        }));
    }

    onChangePagination = page => {
        this.setState({
            current: page,
        });
    };

    inputChangeHandler=(e)=>{
        this.setState({inputValue:e.target.value})
    }

    showModal = (ID) => {
        this.setState({
        visible: true,
        deleteItemID:ID
        });
    };

    openNotification = () => {
        notification.open({
            message: `Coin deleted`,
            icon: <DeleteOutlined style={{ color: '#108ee9' }} />,
        });
    };

    handleOk = item => {
        const token = this.props.token;
        const requestBody = {token:token}
        fetch(`http://localhost:3002/coin/delete/${this.state.deleteItemID}`,{
            method: 'DELETE',
            body: JSON.stringify(requestBody),
            headers: { 'Content-type': 'application/json' }
        })
        .then(res=>res.json())
        .then((data) => {
            this.setState({
                    visible: false,
                    filteredData: this.state.filteredData.filter((el)=>{ return el.ID !== this.state.deleteItemID}),
                    lastPage: +Math.ceil((this.state.filteredData.length-1) / this.state.pageSize)
                });
            this.openNotification()
        })
        .catch((err)=>{
            message.error('Please login!');
            this.setState({visible:false})
            }
        );
      };
    
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    filterDataHandler=()=>{
        const requestBody = {inputValue:this.state.inputValue}
        fetch('http://localhost:3002/search', {
        method:'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-type': 'application/json' }
        })
        .then(res => res.json())
        .then((data) => {
            this.setState({
                filteredData: data,
                lastPage: +Math.ceil(data.length / this.state.pageSize)
            })
        })
        .catch(()=>{
            this.setState({
                filteredData: [],
                lastPage: 0
            });
        })
    }

    logoutHandler=()=>{
        const requestBody = {token:this.props.token}
        fetch('http://localhost:3002/logout', {
        method:'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-type': 'application/json' }
        })
        .then(data=>{
            if(data.status===401){
                console.log(data.statusText)
            }else if(data.status===200){
                this.setState({redirect:true});
                localStorage.removeItem('token');
                localStorage.removeItem('username');
            }
        })
        
    }

    render(){
        if (this.state.redirect) {
            return <Redirect to='/'/>;
          }
        const{filteredData,current,pageSize,lastPage} = this.state
        return(
            <div>
                <h1>Admin panel</h1>
                <Link className='app-link-to-home' to={'/'}><span>Homepage</span>-List of the coins</Link>
                <div className='admin-panel-home'>
                    <div className='admin-filter'>
                        <div className='admin-link-to-logout' onClick={this.logoutHandler}>Logout</div>
                        <p>Input field</p>
                        <div className='search-area'>
                            <Input className='search-input' onChange={this.inputChangeHandler} placeholder='Search'/>
                            <Button className='search-button' onClick={this.filterDataHandler} type="primary">Search</Button>
                        </div>
                    </div>
                    <div className='admin-link-to-add-area'>
                        <Link className='admin-link-to-add' to={'/coin/add'}>+</Link>
                        <Link className='admin-link-to-add-p' to={'/coin/add'}>      
                            Add a new coin
                        </Link>
                    </div>
                    { filteredData
                        .slice(pageSize * (current - 1), pageSize * current)
                        .map(item=>(
                        <div key={item.ID} className='admin-home-item stretchRight'>
                            <CoinsListItem data={item}/>
                            <div className='admin-home-button-area'>
                                <Button className='admin-home-button'><Link to={`/coin/edit/${item.ID}`}>Edit</Link></Button>
                                <Button className='admin-home-button' onClick={()=>this.showModal(item.ID)} >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className='admin-pagination'>
                        <Pagination current={this.state.current} 
                            onChange={this.onChangePagination} 
                            defaultPageSize={pageSize}
                            total={+lastPage*4} />
                    </div>
                    <Modal
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        >
                        <h3>{<ExclamationCircleOutlined className='admin-modal-icon'/>}  
                            Are you sure delete this coin?
                        </h3>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default AdminPanelHome;