import React from 'react';
import './Login.css';
import 'antd/dist/antd.css';
import { Form, Input, Button, notification} from 'antd';
import{Redirect} from 'react-router-dom';
import { SmileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 24,
    },
    layout:"vertical"
  };

const tailLayout = {
    wrapperCol: {
    offset: 9,
    span: 16,
    },
};

class Login extends React.Component{

  state={
    username: localStorage.getItem('username'),
    redirect: false
  }
  
  openNotification = (usName) => {
    notification.open({
      message: `Hello ${usName}. Glad your return`,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  onFinish = values => {
    const requestBody = {
      login: values.username,
      pass: values.password
    };

    fetch('http://localhost:3002/token', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-type': 'application/json' }
      })
      .then(res => res.json())
      .then((data) => {
        // console.log(data);
        this.openNotification(data.login);
        this.props.onLogin(data.token, data.login);
        this.setState({redirect: true})
      });
  };
  onFinishFailed = errorInfo => {
          console.log('Failed:', errorInfo);
        };

    render(){
      const { username,redirect } = this.state;

      if (username || redirect) {
        return <Redirect to='/admin'/>;
      }
        return(
            <div>
              <h1>Admin panel</h1>
              <Link className='app-link-to-home' to={'/'}><span>Homepage</span>-List of the coins</Link>
                <Form
                {...layout}
                id='login-area'
                name="basic"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
              >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button className='login-button' type="primary" htmlType="submit">
                    Sign in
                    </Button>
                </Form.Item>
            </Form>
          </div>
        );
    }
}

export default Login;