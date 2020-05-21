import React from 'react';
import CoinsListItem from '../CoinsListItem';
import './AdminPanelHome.css';
import 'antd/dist/antd.css';
import { Modal, Button,Input,Pagination,notification } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';


class AdminPanelHome extends React.Component{
    state={
        data:[],
        current: 1,
        pageSize: 4,
        visible: false,
        lastPage:'',
        deleteItemID:null
    }
    componentDidMount(){
        this.getData();
    }

    getData=()=>{
        fetch(`http://localhost:3002/coins`)
        .then(res=>res.json())
        .then(data=>this.setState({data:data,lastPage: +Math.ceil(data.length / this.state.pageSize)}));
    }

    onChangePagination = page => {
        this.setState({
            current: page,
        });
    };

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
        fetch(`http://localhost:3002/coin/delete/${this.state.deleteItemID}`,{
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' }
        })
        .then((data) => {
            this.setState({
                    visible: false,
                    data: this.state.data.filter((el)=>{ return el.ID !== this.state.deleteItemID}),
                    lastPage: +Math.ceil((this.state.data.length-1) / this.state.pageSize)
                });
            this.openNotification()
        });
      };
    
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render(){
        const{data,current,pageSize,lastPage} = this.state
        return(
            <div>
                <h1>Admin panel</h1>
                <Link className='app-link-to-home' to={'/'}><span>Homepage</span>-List of the coins</Link>
                <div className='admin-panel-home'>
                    <div className='admin-filter'>
                        <p>Input field</p>
                        <div className='search-area'>
                            <Input className='search-input' placeholder='Search'/>
                            <Button className='search-button' type="primary">Search</Button>
                        </div>
                    </div>
                    <div className='admin-link-to-add-area'>
                        <Link className='admin-link-to-add' to={'/coin/add'}>+</Link>
                        <Link className='admin-link-to-add-p' to={'/coin/add'}>      
                            Add a new coin
                        </Link>
                    </div>
                    { data
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